export enum StatusCode {
  // 2xx Success
  OK = 200,                    // Standard response for successful HTTP requests
  CREATED = 201,               // Request has succeeded and a new resource has been created
  ACCEPTED = 202,              // Request has been accepted for processing but not completed
  NO_CONTENT = 204,            // Server successfully processed the request but is not returning any content
  
  // 4xx Client Errors
  BAD_REQUEST = 400,           // Server cannot process the request due to client error (malformed syntax)
  UNAUTHORIZED = 401,          // Authentication is required and has failed or not been provided
  FORBIDDEN = 403,             // Server understood request but refuses to authorize it
  NOT_FOUND = 404,             // Requested resource could not be found
  METHOD_NOT_ALLOWED = 405,    // Request method is not supported for the requested resource
  CONFLICT = 409,              // Request conflicts with the current state of the server
  UNPROCESSABLE_ENTITY = 422,  // Request was well-formed but unable to be followed due to semantic errors
  TOO_MANY_REQUESTS = 429,     // User has sent too many requests in a given amount of time
  
  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500, // Generic server error message when no specific message is suitable
  NOT_IMPLEMENTED = 501,       // Server does not recognize the request method or lacks ability to fulfill
  BAD_GATEWAY = 502,           // Server acting as gateway received invalid response from upstream server
  SERVICE_UNAVAILABLE = 503,   // Server is currently unavailable (overloaded or down for maintenance)
  GATEWAY_TIMEOUT = 504        // Server acting as gateway did not receive timely response from upstream
}