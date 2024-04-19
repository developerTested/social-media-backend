import { ZodError, z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Define a middleware function for request validation using Zod schemas
const validateRequest = (schema: any): any => {
  
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the provided schema
      schema.parse(req.body);
      // If validation passes, proceed to the next middleware
      next();
    } catch (error) {
      console.log(error.errors);
      
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => err.message);
        
        return res.status(400).json({ error: true, message: errorMessage });
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
