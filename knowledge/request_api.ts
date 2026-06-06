// Client -> Interceptor -> Controller -> Service (Chiều đi) (Request)
// Service -> Controller -> Interceptor -> Client (Chiều về) (Response)

// => Client -> Interceptor -> Controller -> Service -> Controller -> Interceptor -> Client

// Flow:
//     Client -> Middleware -> Interceptor -> Pipe -> Controller -> Service
