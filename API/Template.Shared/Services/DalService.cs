using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Template.Shared.Entities;
using Template.Shared.Exceptions;
using Template.Shared.Extensions;
using Template.Shared.Interfaces.IRepositories;
using Template.Shared.Interfaces.IServices;
using Template.Shared.Models;
using Template.Shared.Results;

namespace Template.Shared.Services
{
    public class DalService : IDalService
    {
        readonly IUserRepository _UserRepository;

        private readonly IInvoiceRepository _InvoiceRepository;

        readonly ILogger<DalService> _Logger;

        public DalService(
            IUserRepository userRepository,
            ILogger<DalService> logger, IInvoiceRepository invoiceRepository)
        {
            _UserRepository = userRepository;
            _Logger = logger;
            _InvoiceRepository = invoiceRepository;
        }


        // CREATE
        public async Task<Guid> CreateEntityAsync(UserModel model) => await CreateUserAsync(model);

        public async Task<Guid> CreateEntityAsync(InvoiceModel model) => await CreateInvoiceAsync(model);

        // DELETE
        public async Task<HttpStatusCode> DeleteEntityAsync(InvoiceModel model) => (await DeleteInvoiceAsync(model.Id.ToString())).Status;

        public async Task<HttpStatusCode> DeleteEntityAsync(UserModel model) => (await DeleteUserAsync(model.Id)).Status;

        // UPDATE
        public async Task<Guid> UpdateEntityAsync(UserModel model)
        {
            var updatedUser = model.ToEntity();
            var updated = await _UserRepository.UpdateAsync(updatedUser);
            return updated.Value.Id;
        }

        public async Task<Guid> UpdateEntityAsync(InvoiceModel model)
        {
            var updated = await _InvoiceRepository.UpdateAsync(model.ToEntity());
            return updated.Value.Id;
        }

        // GET
        public async Task<Result<UserEntity>> GetUserAsync(string id)
        {
            var guid = ValidateGuid(id);

            if (guid != Guid.Empty)
                return await _UserRepository.GetByAsync(u => u.Id == guid);

            return Result<UserEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        public async Task<Result<InvoiceEntity>> GetInvoiceAsync(string id)
        {
            var guid = ValidateGuid(id);

            if (guid != Guid.Empty)
                return await _InvoiceRepository.GetByAsync(id, u => u.Id == guid);
            
            return Result<InvoiceEntity>.Failed(new Error(HttpStatusCode.UnprocessableEntity));
        }

        public async Task<Result<List<InvoiceEntity>>> GetAllInvoices() => await _InvoiceRepository.GetListByAsync();


        // AUTH
        public async Task<Result<UserEntity>> Login(string email, string password)
        {
            var result = await _UserRepository.GetByAsync(u => u.Email == email);

            if (!result.IsSuccess)
            {
                return Result<UserEntity>
                    .Failed(result.Error);
            }

            var verified = password.VerifyHash(result.Value.Password);

            return verified
                ? result
                : Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.Unauthorized));
        }

        public async Task<Result<UserEntity>> ChangePassword(ChangePasswordModel model)
        {
            if (model.ConfirmedPassword != model.NewPassword)
            {
                return Result<UserEntity>
                    .Failed(new Error(HttpStatusCode.PreconditionFailed));
            }

            var verified = await Login(model.Email, model.Password);

            if (!verified.IsSuccess)
            {
                return verified;
            }

            verified.Value.Password = model.NewPassword.Hash();

            return await _UserRepository.UpdateAsync(verified.Value);
        }



        public void CheckForThrow(Error error)
        {
            _Logger.LogCritical(error.Code.ToString());

            if (error.Code != HttpStatusCode.OK)
                throw error.Code switch
                {
                    HttpStatusCode.BadRequest => new BadHttpRequestException(error.Code.ToString()),
                    HttpStatusCode.NotModified => new BadHttpRequestException(error.Code.ToString()),
                    HttpStatusCode.UnprocessableEntity => new GuidException(error.Code.ToString()),
                    HttpStatusCode.NotImplemented => new NotImplementedException(error.Code.ToString()),
                    HttpStatusCode.Ambiguous => new DuplicateException(error.Code.ToString()),
                    HttpStatusCode.NotFound => new NotFoundException(error.Code.ToString()),
                    HttpStatusCode.Unauthorized => new UnauthorizedException(error.Code.ToString()),
                    HttpStatusCode.PreconditionFailed => new UnauthorizedException(error.Code.ToString()),
                    _ => new Exception()
                };
        }

        private async Task<Guid> CreateUserAsync(UserModel model)
        {
            var entity = model.ToEntity();

            var request = await _UserRepository.GetByAsync(u => u.Id == entity.Id);

            if (request.Error.Code != HttpStatusCode.NotFound)
            {
                CheckForThrow(request.Error);
            }

            var result = await _UserRepository.AddAsync(entity);

            CheckForThrow(result.Error);

            return result.Value.Id;
        }

        private async Task<Guid> CreateInvoiceAsync(InvoiceModel model)
        {
            var entity = model.ToEntity();

            if (entity.Id == Guid.Empty)
                entity.Id = Guid.NewGuid();

            var user = await GetUserAsync(entity.Id.ToString());
            if(user.IsSuccess)
                    CheckForThrow(new Error(HttpStatusCode.AlreadyReported));
            
            var result = await _InvoiceRepository.AddAsync(entity);

            CheckForThrow(result.Error);

            return result.Value.Id;
        }

        private async Task<Result<HttpStatusCode>> DeleteUserAsync(string publicKey)
        {
            var result = await GetUserAsync(publicKey);

            if (result.IsSuccess)
            {
                return await _UserRepository.DeleteAsync(result.Value);
            }

            _Logger.LogInformation(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        private async Task<Result<HttpStatusCode>> DeleteInvoiceAsync(string publicKey)
        {
            var result = await GetInvoiceAsync(publicKey);

            if (result.IsSuccess)
            {
                return await _InvoiceRepository.DeleteAsync(result.Value);
            }

            _Logger.LogInformation(result.Error.Code.ToString());

            return Result<HttpStatusCode>.Deleted();
        }

        private static Guid ValidateGuid(string key)
        {
            var valid = Guid.TryParse(key, out var guid);

            return valid ? guid : Guid.Empty;
        }

    }
}