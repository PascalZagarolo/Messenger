import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/"
    }
});

//cover sub-routes of users
export const config = {
    matcher : [
        "/users/:path*",
        "/conversations/:path*"
    ]
}

