import jwt from "jsonwebtoken";

export const authenticate = (req :any , res : any , next : any) =>
{
    const authHeader = req.headers.authorization;

    if ( !authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).json({
            message : "Unauthorized"
        });
    }

        const token = authHeader.split(" ")[1];

        try
        {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        }catch(error)
        {
            return res.status(401).json({
                message : "Invalid or Expired Token"
            });
        }
}

export const authorize = (allowedRoles : string[] ) =>
{
    return ( req : any , res : any , next : any) =>
    {
        const userRole = req.user.role;

        // deny user req if he/she/it is not authorized
        if(!allowedRoles.includes(userRole))
        {
            return res.status(403).json({
                message : "Cannot Access"
            });
        }
        next();
    }
}

