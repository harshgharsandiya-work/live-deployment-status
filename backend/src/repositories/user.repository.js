const prisma = require("../config/prisma");

class UserRepository {
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async upsertGithubUser(githubUser, accessToken, primaryEmail) {
        return await prisma.user.upsert({
            where: { githubId: githubUser.id.toString() },
            update: {
                accessToken,
                username: githubUser.login,
                email: primaryEmail,
                avatarUrl: githubUser.avatar_url,
            },
            create: {
                githubId: githubUser.id.toString(),
                accessToken,
                username: githubUser.login,
                email: primaryEmail,
                avatarUrl: githubUser.avatar_url,
            },
        });
    }
}

module.exports = new UserRepository();
