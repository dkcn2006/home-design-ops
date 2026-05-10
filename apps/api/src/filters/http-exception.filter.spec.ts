import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException, HttpStatus } from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";

describe("HttpExceptionFilter", () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Record<string, jest.Mock>;
  let mockRequest: { url: string };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter]
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockRequest = { url: "/test-url" };
  });

  const createHost = (exception: unknown) =>
    ({
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest
      })
    }) as never;

  it("should format NotFoundException correctly", () => {
    const exception = new NotFoundException("Resource not found");
    filter.catch(exception, createHost(exception));

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Resource not found",
        path: "/test-url"
      })
    );
  });

  it("should include validation errors for BadRequestException", () => {
    const exception = new BadRequestException({
      message: ["name should not be empty", "email must be an email"]
    });
    filter.catch(exception, createHost(exception));

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg.errors).toBeDefined();
    expect(jsonArg.errors.length).toBe(2);
  });

  it("should handle string exception response", () => {
    const exception = new BadRequestException("Invalid input");
    filter.catch(exception, createHost(exception));

    const jsonArg = mockResponse.json.mock.calls[0][0];
    expect(jsonArg.message).toBe("Invalid input");
  });
});
