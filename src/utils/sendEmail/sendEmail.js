import  nodemailer  from "nodemailer";





export const sendEmail= async({to, subject,html})=>{
    console.log(process.env.user);
    console.log(process.env.pass);
    const transporter=nodemailer.createTransport({
        host:process.env.host,
        port:process.env.EmailPort,
        secure:true,
        service:"gmail",
        auth:{
            user:process.env.user,
            pass:process.env.pass
        }
    })


    const main=async () => {
        const info=await transporter.sendMail({
            from:`sarahaApp "<${process.env.user}>"`,
            to,
            subject,
            html
        })
        console.log({info});
        
    }
    main().catch((err)=>{
        console.log(err);
        
    })
}