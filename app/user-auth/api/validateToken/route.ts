import jwt from "jsonwebtoken";
import { headers } from "next/headers";

const verifyToken = (token: any, secret: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export async function POST() {
  try {
    const headersInstance = headers();
    const authHeader = headersInstance.get("authorization") ?? "";

    const token = authHeader.split(" ")[1];

    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    // IF CODE REACHES THIS POINT, THE TOKEN HAS BEEN SUCCESSFULLY VERIFIED. ELSE, THE AN ERROR WILL BE THROWN BY THE jwt.verify FUNCTION ABOVE
    return new Response(
      JSON.stringify({
        data: decoded,
        message: "Token Verified",
        status: 200,
        jwtError: null,
      }),
    );
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return new Response(
        JSON.stringify({
          data: null,
          message: "Token has Expired!",
          status: 401,
          jwtError: error,
        }),
      );
    } else {
      return new Response(
        JSON.stringify({
          data: null,
          message: "Unauthorized Access!",
          status: 401,
          jwtError: error,
        }),
      );
    }
  }
}
