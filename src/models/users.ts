import db from '../../helpers/queryBuilder';

class UserModel {
    async getUserByUsername(key: any) {
        try {
            const resp: any = await db.manual(`
            SELECT a.id as id_user, 
                    a.username,
                    a.password
            from users a
            where a.deleted = false and a.username = '${key}'
            LIMIT 1
            `);
            return resp.length > 0 ? resp[0] : {};
        } catch (error) {
            throw error;
        }
    }
}

export = new UserModel();