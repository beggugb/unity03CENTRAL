module.exports = (img,img2,prospecto,fecha,hora) => {
    const today = new Date();  
    var prevLogo = `<img src="${img}" border="0" alt="logo" width="80" height="80"/>`
    var prevImg  = `<img src="${img2+prospecto.articulo.filename}" border="0" alt="logo" width="210" height="200"/>`    
       
   return `<html>
     <head>
       <meta charset="utf8">
       <title>Prospectos</title>
       <style>
         html, body {
           margin: 0;
           padding: 0;
           font-family: 'Sackers Gothic Std';
           font-weight: 500;
            font-size: 11px;
           background: rgb(241,241,241);
           -webkit-print-color-adjust: exact;
           box-sizing: border-box;
         }
   
         .page {
           position: relative;
           height: 100%;
           width: 100%;
           display: block;
           background: white;
           page-break-after: auto;        
           overflow: hidden;
         }
   
         @media print {
           body {
             background: white;
           }
   
           .page {
             margin: 0;
             height: 100%;
             width: 100%;
           }
         }
   
         .contenedor {        
           height: 98%;
           padding: 8px;
         }
   
       
         .header {
           border: 1px solid #eaeaea;
           border-radius: 2px;
           height: 55px;
           padding: 5px;
           width: 97%;
           margin-top:15px;
           margin-bottom: 2px; 
         }
         .cliente {
            border: 1px solid #eaeaea;
            border-radius: 2px;
            height: 65%;
            padding: 5px;
            width: 40%;
            float:left;
            margin-right:2px;
          }
         .cotizacion {
           border: 1px solid #eaeaea;
           border-radius: 2px;
           height: 65%;
           padding: 5px;
           width: 55%;
           float:left;
         }
   
   
         .tasas {
           border: 1px solid #c1c1c1;
           border-radius: 5px;
           height: 8%;
           padding: 5px;
           background-color: #ebb18b;
         }
   
         .detalle {
           border: 1px solid #c1c1c1;
           border-radius: 5px;
           height: 72%;
           padding: 5px;
         }
   
         .datos {        
           border-radius: 5px;
           height: 100%;        
           width: 20%;
           float: left;
         }
         .companias {        
           height: 100%;        
           width: 80%;
           float: left;
           padding-left: 3px;              
         }
         .tables-companias {        
           width: 100%;        
           height: 72%;
           border-spacing: 0;
           font-size: 11px;
           margin: 0 !important;
         }
   
         .tables-companias td{
           border: 1px solid #c1c1c1;                 
         }
         .tables-companias-titulos{        
           width: 100%;        
           height: 25%;
           border-spacing: 0;
            font-size: 11px;
         }
         .tables-companias-titulos td{
           border: 1px solid #c1c1c1;                     
           
         }
   
   
         .items {
           border: 1px solid #c1c1c1;  
           height: 75%;        
           width: 98%;
           float: left;
           border-radius: 5px;
           padding:5px;
         }
         
   
         .coberturas{          
           background-color: #1b88e4;                
           text-align: center;
           padding: 1px;
           color: #fff;
           font-weight: 600;
         }
         .clausulas{             
           background-color:  #1baae4;      
           text-align: center;
           padding: 1px;
           color: #fff;
           
         }
         .tables-clausulas {        
           width: 100%;                 
           border-spacing: 0;
           font-size: 11px;
           background-color: #fff;
         }
   
         .tables-clausulas td{
           border: 1px solid #c1c1c1;    
           text-align: center;               
         }
      
         .cobe{
           text-align: left !important; 
           padding-left: 2px;
           font-size: 9px;
         }
         .cobes{
            text-align: left !important; 
            padding-left: 2px;
            font-size: 8px;
          }
          .cobet{
            text-align: center !important; 
            padding-left: 2px;
            font-size: 8px;
            background-color: #eaeaea;
            font-weight: bold;

          }
          .cobi{
            text-align: center !important; 
            padding-left: 2px;
            font-size: 8px;
            background-color: #eaeaea;
          }
         .cob{
           font-size: 9px;
           text-align: center  !important; 
         }
         .cof{
           height: 60px;
           font-size: 9px;
           text-align: center !important;         
         }
         .com{
           height: 20px;
           font-size: 9px;
           text-align: center !important; 
           background-color: #009bd4;
         }
   
         .table-datos{                
           width: 99%;
           border-spacing: 0;
         }
         
   
         .table-datos td{                
           font-size: 9px; 
           border: 1px solid #eaeaea;     
           padding:8px;  
         }
         .table-datosi{                
            width: 99%;
            border-spacing: 0;
          }
          
    
          .table-datosi td{                
            font-size: 9px; 
            border-bottom: 1px solid #eaeaea;     
            padding:7px;  
          }
         h5{
           margin-left:15px;
           font-size: 8px !important;
         }
         h4{
            text-align:center;
            font-size: 8px !important;
          }
         .cami {
          font-size: 8px !important;
         } 
       </style>
     </head>
     <body>
       <div class="page">
         <div class="contenedor">  
         ${prevLogo}
         <h4>Prospecto</h4> 
         <h4>${prospecto.nombre}</h4> 
           <div class="header">   
            <table class="table-datosi">
                <tr>
                    <td width="15%" class="cami"><b>Nro  :</b></td>                            
                    <td width="20%" class="cami">${prospecto.id}</td>                            
                    <td width="10%" class="cami"><b>Tipo  :</b></td>                            
                    <td width="20%" class="cami">${prospecto.tipo}</td>                            
                    <td width="10%" class="cami"><b>Fecha  :</b></td>                            
                    <td width="20%" class="cami">${prospecto.fecha}</td>            
                </tr>
                <tr>
                    <td width="15%" class="cami"><b>Observaciones  :</b></td>                            
                    <td width="85%" colspan="5" class="cami">${prospecto.observaciones}</td>                                                
                </tr>                            
            </table>
           </div>   
           <div class="cliente">  
           <h5>Código # ${prospecto.articulo.codigoBarras}</h5>                 
           ${prevImg}
           </div>
           <div class="cotizacion">    
           <h5>Descripción</h5>                
           <table class="table-datosi">
            <tr>
                <td width="30%" class="cami"><b>Código  :</b></td>                            
                <td width="70%" class="cami">${prospecto.articulo.codigoBarras}</td>            
            </tr>
            <tr>
                <td width="30%" class="cami"><b>Nombre  :</b></td>                            
                <td width="70%" class="cami">${prospecto.articulo.nombre}</td>            
            </tr>
            <tr>
                <td width="30%" class="cami"><b>Nombre Corto  :</b></td>                            
                <td width="70%" class="cami">${prospecto.articulo.nombreCorto}</td>            
            </tr>
            <tr>
                <td width="30%" class="cami"><b>Categoría  :</b></td>                            
                <td width="70%" class="cami">${prospecto.articulo.categoria.nombre}</td>            
            </tr>
            <tr>
                <td width="30%" class="cami"><b>Marca  :</b></td>                            
                <td width="70%" class="cami">${prospecto.articulo.marca.nombre}</td>            
            </tr>
            <tr>                
                <td width="30%" class="cami"><b>Precio Venta :</b></td>                                    
                <td width="70%" class="cami">${parseFloat(prospecto.articulo.precioVenta).toFixed(2)} Bs.</td>
            </tr>  
            <tr>                
                <td width="30%" class="cami"><b>Descripción :</b></td>                                    
                <td width="70%" class="cami">${prospecto.articulo.descripcion}</td>
            </tr>             
           </table>
           <h5>Fecha : ${fecha}</h5>
           <h5>Hora : ${hora}</h5>
           </div>
         </div>  
       </div>    
     </body>
   </html>	`;
   };
   