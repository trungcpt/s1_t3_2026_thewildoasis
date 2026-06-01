// Dependency Injection

interface Log {
  log(message): void;
}

class Logger implements Log {
  log(message) {
    console.log('>>> Log:', message);
  }
}

class WinstonLogger implements Log {
  log(message) {
    console.log('>>> Winston log:', message);
  }
}

class UserService {
  private logger: Log;
  // Dependency Injection
  constructor(logger: Log) {
    // this.logger = new Logger(); // new WinstonLogger()
    this.logger = logger;
  }

  createUser(user) {
    this.logger.log(`Creating user ${user}`);
    // created user
  }
}
const logger = new Logger();
const winstonLogger = new WinstonLogger();
const userService = new UserService(winstonLogger);
userService.createUser('trungcpt');
