export function prismaErrorHandler(error: any) {
    console.log(error,error.code)
    switch (error.code) {
      case 'P2002': {
        return `A record with the same ${error.meta.target.join(
          ',',
        )} already exists`;
      }
      case 'P2025': {
        return error.meta.cause;
      }
  
      default: {
        return error;
      }
    }
  }
  