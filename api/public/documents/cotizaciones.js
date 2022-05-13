module.exports = (img1,img2,cotizacion,items,empresa,observaciones,fecha,hora) => {        
    var Logo     = `<img src="${img1}"/>`        
    var productos = "<table class='tables-detalles' cellspacing='0' cellpadding='0'>";
    productos += "<tr>";       
        productos += "<td width='10%' class='com'>Img</td>";
        productos += "<td width='30%' class='com'>Código</td>";        
        productos += "<td width='50%' class='com'>Artículo</td>";                        
        productos += "<td width='10%' class='com'>Cantidad</td>";        
        productos += "</tr>";
    for(var i in items){
        productos += "<tr>";       
        productos += "<td width='10%' class='cobes'>"+`<img src="${img2+items[i].articulo.filename}" border="0" alt="logo" width="25" height="25"/>`+"</td>";
        productos += "<td width='15%' class='cobes'>"+items[i].articulo.codigo+"</td>";        
        productos += "<td width='40%' class='cobes'>"+items[i].articulo.nombre+"</td>";        
        productos += "<td width='10%' class='cobes'>"+items[i].cantidad+"</td>";        
        productos += "</tr>";
    }
  
 productos += "</table>"; 
   
   return `<html>
   <head>
     <meta charset="utf8">
     <title>Cotizacion - UNITY</title>
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
          padding: 5px;          
        }
  
        .titulo {
          border-bottom : 1px solid #eaeaea;
          border-radius: 3px;
          height: 67px;
          padding: 5px;
          width: 97%;
         
        }
                
        .logos {          
          border-radius: 3px;
          height: 20%;
          width: 20%;          
          text-align: left;
        }
        .logos img {
          height: 65px;
          width: 67px;          
        }
        .titulos {          
          border-radius: 3px;
          height: 67px;
          width: 99%;          
        }    
        .table-datos {                    
          height: 25px;
          padding: 5px;
          width: 99%;
        }  
        .table-datos td {            
          font-size: 9px;
        }
        .rtitulo{
          text-align: right;          
          font-weight: bold;
          font-size: 17px;
        }
        .ctitulo{
          text-align: left;          
          font-weight: bold;
          font-size: 17px;
        }
        .ltitulo{
          text-align: left;                    
          font-size: 16px;
        }
        .ttitulo{
          text-align: left;                              
          font-size: 7px !important;     
          font-weight: bold;  
          padding:2px;   
        }
        .stitulo{
          text-align: left !important;                     
          font-size: 7px !important;          
          padding:2px;
        }
        .cliente {
          border: 1px solid #eaeaea;
          border-radius: 3px;
          height: 65px;
          padding: 3px;
          width: 100%;
        }
        .items {
          margin-top: 10px;
          border: 1px solid #eaeaea;
          border-radius: 3px;
          height: 520px;
          padding: 3px;
          width: 100%;
        }
        .tables-detalles {
          border: 1px solid #eaeaea;
          width: 100%;
        }
        .tables-detalles td{
          
        }
        h3{          
          font-size: 7px !important;          
          padding:0;  
          font-weight: normal;      
        }
        .com{
          text-align: left;                    
          font-size: 7px !important;          
          padding:2px;
          background-color: #e9e9e9;
          border: 1px solid #eaeaea;
        }
        .cobes{
          text-align: left;                    
          font-size: 7px !important;          
          padding:2px;          
          border: 1px solid #eaeaea;
        }
        .cobess{
          text-align: left;                    
          font-size: 7px !important;          
          padding:2px;                    
        }
        .cobet{
          text-align: left;                    
          font-size: 7px !important;          
          padding:2px;                    
          font-weight: bold;  
        }
        .hora{
          text-align: left;                    
          font-size: 7px !important;          
          padding:2px;                    
        }
       </style>
   </head>
   <body>
    <div class="page">
      <div class="contenedor">
        <div class="titulo">                      
         <div class="titulos">
          <table class="table-datos" cellspacing="0" cellpadding="0">
            <tr>
              <td width="30%" rowspan="4" class="logos">${Logo}</td>                            
              <td width="70%" class="rtitulo">Cotización # ${cotizacion.id}</td>                          
            </tr>
            <tr><td width="70%" class="ctitulo">${empresa.nombre}</td></tr> 
            <tr><td width="70%" class="ltitulo">${empresa.direccion}</td></tr>
            <tr><td width="70%" class="ltitulo">${empresa.email}</td></tr>               
          </table>
         <div>
        </div>  
        
       
        
        <div class="cliente">
          <table class="table-datos" cellspacing="0" cellpadding="0">
            <tr>
              <td width="20%" class="ttitulo">Nº Intems :</td>                            
              <td width="40%" class="stitulo">${cotizacion.nroItems}</td>
              <td width="20%" class="ttitulo">Total :</td>                            
              <td width="40%" class="stitulo">${cotizacion.totalGeneral} Bs.</td>
            </tr>         
            <tr>
              <td width="20%" class="ttitulo">Forma de pago :</td>                            
              <td width="40%" class="stitulo">${cotizacion.formaPago}</td>
              <td width="20%" class="ttitulo">Forma de entrega :</td>                            
              <td width="40%" class="stitulo">${cotizacion.formaEntrega}</td>
            </tr> 
            <tr>
              <td width="20%" class="ttitulo">Motivo :</td>                            
              <td width="40%" colspan="3" class="stitulo">${cotizacion.observaciones}</td>              
            </tr>        
          </table>
        </div>

        <div class="items">
          ${productos}
        </div>

        <p class="hora">Fecha y Hora : ${fecha} - ${hora} </p>
      </div>
    </div>      
   </body>
 </html>`;
   };
   