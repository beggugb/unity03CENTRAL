module.exports = (img1,img2,promocion,empresa,fecha,hora) => {                     
   var Logo     = `<img src="${img1}"/>`            
   var prevImg  = `<img src="${img2+promocion.articulo.filename}" border="0" alt="logo" width="210" height="200"/>`        
   
   return `<html>
   <head>
     <meta charset="utf8">
     <title>Promoción - UNITY</title>
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
          border : 4px solid #eaeaea;    
        }
  
        .titulo {
          border-bottom : 1px solid #eaeaea;
          border-radius: 3px;
          height: 90px;
          padding: 5px;
          width: 97%;
        }

        .titulos {                    
          border-radius: 3px;
          height: 88px;
          width: 99%;          
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
    
        .items {
          margin-top: 10px;        
          border-radius: 3px;
          height: 280px;
          padding: 3px;
          width: 100%;
          margin-bottom: 60px;
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
        .imagen{
          border: 1px solid #eaeaea;  
          width: 40%;
          height: 250px;
          float: left;
          padding:10px;
          border-radius: 5px;
        }
        .articulo{
          border: 1px solid #eaeaea;    
          width: 50%;
          height: 250px;
          float: left;
          margin-left: 10px;
          padding:10px;
          border-radius: 5px;
        }

        .cliente {
            border: 1px solid #eaeaea;
            border-radius: 3px;
            height: 50px;
            padding: 3px;
            width: 100%;
            margin-top: 30px;
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
                    <td width="70%" class="rtitulo">Promoción # ${promocion.id}</td>                          
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
            <td width="20%" class="ttitulo">Fecha :</td>                            
            <td width="40%" class="stitulo">${promocion.fecha}</td>
            <td width="20%" class="ttitulo">Tipo :</td>                            
            <td width="40%" class="stitulo">${promocion.tipo}</td>
          </tr>
          <tr>
            <td width="20%" class="ttitulo">Titulo :</td>                            
            <td width="40%" colspan="3" class="stitulo">${promocion.nombre}</td>              
          </tr>                
          <tr>
            <td width="20%" class="ttitulo">Observaciones :</td>                            
            <td width="40%" colspan="3" class="stitulo">${promocion.observaciones}</td>              
          </tr>                
        </table>
      </div>

        <div class="items">
        <div class="imagen">  
            <h5>Código # ${promocion.articulo.codigoBarras}</h5>           
                ${prevImg}
        </div>
    <div class="articulo">            
    <h5>Descripción</h5>                
    <table class="table-datos">
     <tr>
         <td width="30%" class="ttitulo"><b>Código  :</b></td>                            
         <td width="70%" class="stitulo">${promocion.articulo.codigoBarras}</td>            
     </tr>
     <tr>
         <td width="30%" class="ttitulo"><b>Nombre  :</b></td>                            
         <td width="70%" class="stitulo">${promocion.articulo.nombre}</td>            
     </tr>
     <tr>
         <td width="30%" class="ttitulo"><b>Nombre Corto  :</b></td>                            
         <td width="70%" class="stitulo">${promocion.articulo.nombreCorto}</td>            
     </tr>
     <tr>
         <td width="30%" class="ttitulo"><b>Categoría  :</b></td>                            
         <td width="70%" class="stitulo">${promocion.articulo.categoria.nombre}</td>            
     </tr>
     <tr>
         <td width="30%" class="ttitulo"><b>Marca  :</b></td>                            
         <td width="70%" class="stitulo">${promocion.articulo.marca.nombre}</td>            
     </tr>
     <tr>                
         <td width="30%" class="ttitulo"><b>Precio Venta :</b></td>                                    
         <td width="70%" class="stitulo">${parseFloat(promocion.articulo.precioVenta).toFixed(2)} Bs.</td>
     </tr>  
     <tr>                
         <td width="30%" class="ttitulo"><b>Descripción :</b></td>                                    
         <td width="70%" class="stitulo">${promocion.articulo.descripcion}</td>
     </tr>             
    </table>
    </div>
        </div>

        <h3><b>Garantias :</b> ${empresa.garantiaCotizacion} </h3>
        <h3><b>Politicas:</b>  ${empresa.politicaCotizacion} </h3>
        <p class="hora">Fecha y Hora : ${fecha} - ${hora} </p>
      </div>
    </div>      
   </body>
 </html>`;
   };
   