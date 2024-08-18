import {Request,Response} from 'express';
import User from '../model/user';

const chatController = {
    totalUsers: async (req:Request,res:Response):Promise<Response> => {
        try {
            const totalUsers = await User.find();
            console.log(totalUsers);
            if(totalUsers){
                return res.status(200).send({
                    data:totalUsers
                })
            }else{
                return 
            }
            
        } catch (error) {
            return res.status(500).send({
                message:"error fetching the users"
            })
        }
    }
}

export default chatController