
require("dotenv").config();
export class ConfigurationApp{
    static app = {
        name:process.env.APP_NAME??"",
        host:process.env.APP_HOST??"localhost",
        app_env : process.env.APP_ENV??"development",
        version : process.env.APP_VERSION??"development",
        port: Number(process.env.APP_PORT??3000),
        time_zone :process.env.APP_TIMEZONE??"Asia/Jakarta",
        secret_key:process.env.SECRET_KEY
    };
    static database = {
        user:process.env.DB_USER??"",
        password:process.env.DB_PASSWORD??"",
        host:process.env.DB_HOST??"127.0.0.1",
        port:Number(process.env.DB_PORT??5432),
        name:process.env.DB_NAME??""
    }
}