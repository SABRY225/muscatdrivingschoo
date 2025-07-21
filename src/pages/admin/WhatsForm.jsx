import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Button  , Box , InputLabel , Typography , Paper , TextField , useForm,Controller} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector }    from "react-redux";
import Cookies            from "js-cookie";
import Loading            from "../../components/Loading-small";
import LoadingSendMessage from "../../components/Loading-small";
import QRCode             from "react-qr-code";
import { useWhatData }    from "../../hooks/useWhatData";
import socketIO           from "socket.io-client";

export default function WhatsForm() {
  const { token }             = useSelector((state) => state.admin);
  const { data, isLoading }   = useWhatData(token);
  const [ url, setURL] = useState([]);

  const { phone }             = useParams();
  const [displayQRCode , setDisplayQRCode]  = useState(false);
  const [qrcode, setQRCode]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const { t }                 = useTranslation();
  const [message, setMessage] = useState('');
  const { enqueueSnackbar }   = useSnackbar();
  const lang                  = Cookies.get("i18next") || "en";
  var socket                  = socketIO.connect("https://animated-space-zebra-5grrjqj7gxx627grp-3001.app.github.dev/" , {});

  const sendMessage = () => {
    console.log(message);
    console.log("START SEND MESSAGE");
    setLoading(true);
    setLoadingMsg( t("msg_whatsapp_two") );
    socket.emit("sendMessage",{
      id_connect  : "muscat",
      message     : message,
      phone       : phone,
    });
  };

  async function onSubmit(){
    console.log("Enter Submit");
    setLoading(true);
    setLoading( t("msg_whatsapp_two") );
    socket.emit("sendMessage",{
      id_connect : "muscat",
      message : message,
      phone   : phone,
    });
    
  };
  
  useEffect(() => {
    console.log("Get Ueser Effect");

    console.log(data);
    if (data?.data) {
      setURL(data?.data);
      console.log(data?.data.url);

      socket =  socketIO.connect(data?.data.url , {});
      socket.disconnect().connect();
      console.log("New Connected");
    }

    // socket.on("connected" , "Hello From Client");
   
  }, [data]);

  useEffect(() => {
   console.log("New User Effect");
    socket.on("qr" , (data)=>{
      const { qr } = data;
      console.log("QR Received = " , qr);
      setQRCode(qr);
      setLoading(false);
      setLoadingMsg(t("msg_whatsapp_one"));
      setDisplayQRCode(true);
    });

    socket.on("ready",(data) => {
      console.log(data);
    });

    socket.on("sendstatus",(data) => {
      setDisplayQRCode(false);
      setLoading(true);
      setLoadingMsg(t("msg_whatsapp_two"));
      console.log(data);

      setTimeout( () => {
        setLoading(false);
        setLoadingMsg( t("msg_whatsapp_three") );
      }, 10000);
    });
    
    
    // socket.on("connected" , "Hello From Client");
   
  }, []);


  

  

  return (
    <AdminLayout>
      <Paper sx={{ padding: "20px" }}>
      {!isLoading ? (
        <Box sx={{ marginBottom: "26px" }}>

<InputLabel disabled="true" sx={{ marginBottom: "6px", fontSize: "18px" , fontWeight:"bold" , color:"#000"}}> {t("title_send_mail")} </InputLabel>
<div>
    <textarea value={message} className="textarea" onChange={(e) => setMessage(e.target.value)} style={{width:"100%", height: "130px !important;"}}></textarea>
    <div style={{display:"none"}}>
      { 
      ( !loading ) ?
        <LoadingSendMessage style={{width:"40px" , height:"33vh" , padding:"0px"}} />
      : ""
      }
    </div>
    <br />

    <Button variant="contained" onClick={sendMessage} sx={{ml:"6px",mr:"6px" , marginTop:"20px"}}>{t('send')}</Button>
</div>
{ ( displayQRCode  ) ? 
<div>
  <QRCode value={qrcode} style={{display:"block"}} />
</div>
: ""}
{ ( loading  ) ? ( //&& qrcode
    <div>
      <Loading />
      <p style={{textAlign:"center" , marginBottom:"10px"}}> ارجوا الانتظار قليلا الي ان يتم ارسال الرسائل </p>
    </div>
 ) :
 (
  <div style={{ margin: "20px" , display : "block"}}>
    <p>{loadingMsg}</p>
  </div>

  
 )}

<div>
<br />
<br />
<br />
{t("whatsappnumber")} = {phone}
</div>
<br />

<br />
<br />
<br />

  <p><b>ملحوظه :</b> يرجي مسح QR Code لكي يتم التواصل مع حساب واتس اب و لكي يتم من خلاله ارسال الرسائل و ان حدث اي خلل خلال مسح  QR code يرجى حذف الاتصال السابق و اعاده الاتصال مره اخرى  </p>
</Box>
      ) : (
                <Loading />
              )}
      
      
      </Paper>
    </AdminLayout>
  );
}
