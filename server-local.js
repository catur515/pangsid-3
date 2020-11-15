'use strict';


var fetch=require("node-fetch");
var fs=require("fs");
var cors = require('cors');
var express = require('express')
const app = require('./express/server');
var path =require("path");
var dialogflow = require('dialogflow');
var sessionId = "catur-adi-sukrisno";
var portfinder = require('portfinder');
var bodyParser = require('body-parser')
var defaultKeyword="";
const util = require('util');
const uuidv4  = require('uuid/v4');
var sessionId = uuidv4();
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCj35j9UJClQ0zL\ntuIAZCOeOrX4xS7t+rGCExmjeOI2XzbGvpuzrmKLt+OvjhztWbLObDLXWTy7sR7j\nT1RE6ZVPnAy19zfQ3xOIt+JNopZkv+/I8LZM8OYJB4JhmpDLm6tkZeb0fEYVO6pK\nCXPi11Ecc84f7+ThHYUCr7IZZ48ZNwfY2FAc6JFBGdVmhvM+kR54blv6G9mjcW+X\nDQmQZKbhRsDXS8bj+L5Qua5NkgPAkHzz4E9uATCpHNQuWnbqyNNkbAZp8Ice8O4I\nakLe41vl1mqpCddv7Z2LWZH13Pymac8NyUAGQ5Wd7t255ggRTyGOwhD1L8g5ZwrQ\n6YC88Id/AgMBAAECggEATEB78MsvMycYseX8TZBLHpJVIFeoWaYAOPVoRa+3GvO9\nCkehLb+kLT043fRzs2G8mN6x3ZCxeOiW5dCA9rv19SA4redF+pQCg+iEjflsn57M\nFaUkPrMNZwAug/onDAb4fnQIPpUhCzpDJ8Y0PUZRgLrGHAhFaRaSUMiuR7HvXRyG\nATirSuQj5yELRQkw8Zqw7hSo/AyGlOVZi7QOLY7X1DfAFoZTIswol4Y6rOagxiEG\n3DApvQ3WDC232AACgBGQNV0I5ve+B+k8lsBVIO6FU2K66xATKrKmyynnicSz2URA\nCSMuUhXuBwIX0PwaTAKuF6S38D4sow3wuprKpXph+QKBgQDdd1mq5CqrOAETQKh9\n7l7aDaVWG4sNwHX4wKqHlxKtbvALxsUdhBKZ2FG7v4Kx6IH4flSyC2VcnlgJgUVc\nfiryLzxdZjnSx8eZnIfDbHYyFeBtyKzz8mU1jiFNo3uALtZgmc2aDkUBSLarLW8F\najh5ZgrJHxkvCl+DlsCS5CgIEwKBgQC9bTdz+RJk53evA/VcB6BPeZsEzkIy54H2\nWIzAXhD2MF4KsqKJB0Fw9UwZpgQfrbcEsC7YIVv+RJPQ7r94zFV7AF9QvAzTsIwX\nMrd5s+RkjTrhq6kE8hRivEv6/MbdgMjAuBJRodPzGBiInr/d23SgqwwOFIt2siSr\nIJOVSaBIZQKBgQCHPpl9qPT9tqfBcBz1OpqmIuszGILklQH2NQJu5y06yKLDLlG1\n4q/RT68qLpvLtaeZbtyeFiOCWhh9RXpsL4heecYta34oYGReRJ8MErJjh8SUhpZI\nK2DvQarI1OtYrkGwoHxUdh5h2FvlUUuZTPLMACraA6nHdlg57dgQXFCuDQKBgH4t\nL9DaSbxYykoT8u2YTtphgDbVRRcvSkxTc333qoiycxHhJ47q/FZHrqcvBHQtfElt\nKebhYaue9m8nePb39MB34QWgHVMsuEQDjl9MyoeH437Kn00iCx4xmtLWaYjF7fMh\nKWKiztGQbVcjl14qfic/iEoguT0ZMH+ktWmtn0xZAoGAVjphLxfOugFme1ElMRm6\n7SCi6AhknlFGV0AD0B5/3QndZtokXAd+YBXwo6nP3YJrVVj3KMEJaOKNucEyvRyq\nfmn8lYSAz+s3jHL/ovrVFbCdmBeK1rXeta0vBhbEpMqLlPiEKAcc3VSdb/A8bG5I\ncX2Q19DQiBH+ghRUcxhOSr0=\n-----END PRIVATE KEY-----\n";
const clientEmail="catur-jgnful@appspot.gserviceaccount.com";
const projectId="catur-jgnful";
const LANGUAGE_CODE = 'id-ID';
const moment =require("moment");
var nodemailer = require('nodemailer');
const ms = require('mediaserver');
ms.noCache =true;
const requestIp = require('request-ip');
const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const password = 'caturadisukrisno';
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
     let decrypted = decipher.update(text, 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     return decrypted;
}

app.set('port', (process.env.PORT || 1515));
app.use(requestIp.mw())
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(cors())
app.use(express.static(__dirname + '/public'));
console.log('Mengaktifkan portable server.. mohon tunggu..');

app.get('/', async function(request, response) {
  response.send('Hello World!, This is Me Catur Adi Sukrisno !! <br>WHat are you looking for ??')
})

app.get('/whatismyip', function(request, response) {
  response.send(request.clientIp);
})

function randomvar(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

app.get('/dekripeopo', function(request, response) {
       if (typeof request.query.code=='undefined'){
           response.end("Silahkan hubungi developer di nomor 082133381777");
       }else{
          var text = request.query.code
       }
       let dekrip = decrypt(text);
       response.send(dekrip);
});

app.get('/check', function(request, response) {
        let ip = request.clientIp;
        let allowed = JSON.parse(fs.readFileSync('./allowed.json', 'utf8'));
        let config = allowed.find(key=>key.ip == ip);
        var now = moment(new Date());
        if (typeof config!=='undefined'){
             var name = config.name;
             var date_end = moment(config.date_end,"DD-MM-YYYY");
             var duration = moment.duration(date_end.diff(now));
             var expired = duration.asDays().toFixed(0);
             response.send({text:"Oke",code:encrypt(ip), expired:expired,name:name});
        }else{
           response.send({text:"undefined",code:encrypt(ip),expired:"unknown",name:"unknown"});
        }
});

app.get('/audio.mp3', function(request, response) {
      var currentPath = process.cwd();
      let ip = request.clientIp;
      var namadir = ip.replace(/\./g,"");
          namadir = namadir.replace(/\:/g,"");
      response.sendFile(currentPath+'/'+namadir+'/audio.mp3');
})

app.get('/getaudio', async function (request, response) {
        let sessionId = uuidv4();
        let allowed = JSON.parse(fs.readFileSync('./allowed.json', 'utf8'));
        let ip = request.clientIp;
        let check = allowed.find(key=>key.ip == ip);

        if (typeof request.query.kata=='undefined'){
           var kata="Silahkan hubungi Catur Adi Sukrisno di nomor kosong delapan satu tripel tiga, delapan satu tripel tujuh";
        }else{
           var kata=request.query.kata;
        }

        if (typeof check ==='undefined'){
           var kata="Silahkan hubungi Catur Adi Sukrisno di nomor kosong delapan satu tripel tiga, delapan satu tripel tujuh";
           if (typeof request.query.maybe!='undefined'){
                if (request.query.maybe==='caturadisukrisno') {
                    var kata=request.query.kata;
                }
           }
        }

        var namadir = ip.replace(/\./g,"");
            namadir = namadir.replace(/\:/g,"");
        var dir = './'+namadir;
        if (!fs.existsSync(dir)){
            await fs.mkdirSync(dir);
        }
        let config = {
                credentials: {
                    private_key: privateKey,
                    client_email: clientEmail
                }
        };


        sessionClient = new dialogflow.SessionsClient(config);
        sendTextMessageToDialogFlow("informasi "+kata, sessionId);

        async function sendTextMessageToDialogFlow(textMessage, sessionId) {
            const sessionPath = this.sessionClient.sessionPath(projectId, sessionId);
            const permintaan = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: textMessage,
                        languageCode: LANGUAGE_CODE
                    }
                },
                outputAudioConfig: {
                  audioEncoding: `OUTPUT_AUDIO_ENCODING_MP3`,
                  synthesizeSpeechConfig : {
                    speakingRate: 0.9,
                    pitch: 0.5,
                    effectsProfileId: [
                      "large-home-entertainment-class-device"
                    ]
                  }
                },

            }

              try {
                    let responses = await this.sessionClient.detectIntent(permintaan);
                    query           =responses[0].queryResult;
                    parameters      =query.parameters.fields;
                    messages        =query.fulfillmentMessages;
                    const audioFile = await responses[0].outputAudio;//
                    await util.promisify(fs.writeFile)('./'+dir+'/audio.mp3', audioFile, 'binary');
                    response.send({value:'halooo'});
                    // ms.pipe(request,response,'./'+dir+'/audio.mp3);
              } catch (err) {
                  response.end({text:"Gagal membuat audio !"});
              }
        };

});

app.get('/stream', (req, res) => {
    var currentPath = process.cwd();
    let ip = req.clientIp;
    var namadir = ip.replace(/\./g,"");
        namadir = namadir.replace(/\:/g,"");

    const file = currentPath+'/'+namadir+'/audio.mp3';
    ms.pipe(req,res,file);
});

app.post('/sendemail', function(request,response){
          let formdata = request.body.formData;
          for (var i = 0; i < formdata.length; i++) {
               if (formdata[i]["name"]=="subjeck"){
                    var subjeck = formdata[i]["value"]
               }
               if (formdata[i]["name"]=="code"){
                    var code = formdata[i]["value"]
               }
               if (formdata[i]["name"]=="email"){
                    var email = formdata[i]["value"]
               }
               if (formdata[i]["name"]=="instansi"){
                    var instansi = formdata[i]["value"]
               }
               if (formdata[i]["name"]=="message"){
                    var message = formdata[i]["value"]
               }
          }
          var isipesan ="Instansi : "+instansi+"\nCode : "+code+"\nemail : "+email+"\nIsi Pesan : "+message;

          let transporter = nodemailer.createTransport({
            sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail'
        });

        transporter.sendMail({
            from : 'catur515@gmail.com',
            to: 'catur.sawahlunto@gmail.com',
            subject: subjeck + 'Pangsid',
            text: isipesan
        }, (err, info) => {
            response.send({val:1,message:info})
        });

})

var publicdir = __dirname + '/';

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(publicdir,{extensions:['json']})); //or ,{index:false, extensions:['json']}
app.use(function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(404);
    res.json({
        error: {
            code: 404
        }
    });
})

app.listen(app.get('port'), function() {
  console.log("Pangsid sudah aktif di port :" + app.get('port'));
})

