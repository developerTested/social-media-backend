import { Response, NextFunction } from 'express';
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";

function getInitials(inputName: string) {
    const names = inputName.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
}

function stringifyToJSON(data) {
    const json = JSON.stringify(data, (key, value) => (typeof value === 'bigint' ? value.toString() : value));
    return JSON.parse(json);
}


function exclude(param: object, key: string[]) {
    key.map((x) => delete param[x]);
    return param;
}

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

export {
    exclude,
    getInitials,
    stringifyToJSON,
    validateRequest,
}