import ArticuloService from "../services/ArticuloService";
import AlmacenItemsService from "../services/AlmacenItemsService";
import ClienteService from "../services/ClienteService";
import CompraService from "../services/CompraService";
import CompraItemsService from "../services/CompraItemsService";
import VentaService from "../services/VentaService";
import VentaItemsService from "../services/VentaItemsService";
import CajaService from "../services/CajaService"
import PlanService from "../services/PlanService";
import CotizacionService from "../services/CotizacionService";
import ProspectoService from "../services/ProspectoService";
import TicketService from "../services/TicketService"
import MovimientoService from "../services/MovimientoService"
import ComprobanteService from "../services/ComprobanteService";

class InformesController {

  static contabilidad(req, res) {
    const { usuarioId, gestion } = req.body;          
    ComprobanteService.getComprobanteLast(gestion,'transcripción')
      .then((xdata)=>{
        res.status(200).send({ result: { xdata }});
      })  
      .catch((reason) => { 

          res.status(400).send({ message: reason });
      });
  }

  static cexistencias(req, res) {
    const { usuarioId, gestion } = req.body;          
    Promise.all([
      AlmacenItemsService.sumArticulos(),
      AlmacenItemsService.countArticulos(),
      AlmacenItemsService.sumArticulo(),
      AlmacenItemsService.countArticulo(),
      MovimientoService.getListaDetalle(gestion,'Ingreso'),
      MovimientoService.getListaDetalle(gestion,'Salida'),
      AlmacenItemsService.getRotacionArticulo()

    ])
        .then(([xtotal,xitems,ytotal,yitems,xingresos,xsalidas,xproductos]) => {                    
          let zporcentajes = parsear(xtotal.total,xitems)
          let zcantidades  = parsear(ytotal.total,yitems) 
          let yingresos = parsearMes(xingresos)
          let ysalidas  = parsearMes(xsalidas)
          let labelProductos = []
          let itemsMinimo = []
          let itemsActual = []
          
          xproductos.map((item,index)=>{                
            labelProductos.push(item.articulo.nombre)
            itemsMinimo.push(item.articulo.smi)
            itemsActual.push(item.stock)          
          })

          res.status(200).send({ result: { zporcentajes, zcantidades, yingresos,ysalidas,labelProductos, itemsMinimo, itemsActual}} );          
        })
        .catch((reason) => { 
          console.log(reason)
          res.status(400).send({ message: reason });
        });
  }
  
  static movimientos(req, res) {   
    const { desde, hasta, tipo } = req.body;    
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    MovimientoService.getDetalle(fdesde,fhasta,tipo)
    .then((xdata)=>{     
      let data = xdata.data.map((it,index)=>{
        let eok = {
            "id"            : it.id,
            "origen"        : it.origen,
            "destino"       : it.destino,
            "nroItems"      : it.nroItems,
            "fecha"         : it.fecha,
            "tipo"          : it.tipo,
            "motivo"        : it.motivo,
            "totalGeneral"  : it.totalGeneral
        }        
        return eok;
    })    
    res.status(200).send({message:"movimientos lista", result: { data:data, total:xdata.total }  }); 
    })
    .catch((reason) => {         
       console.log(reason)
      res.status(400).send({ message: reason });
    });
      
  }

  static existencias(req, res) {
    const { almacenId,articuloId,categoriaId,value,rango,vrango } = req.body;        
    
    console.log(almacenId)

    AlmacenItemsService.getDetalle(almacenId,articuloId,categoriaId,value,rango,vrango)
    .then((detallex) => {        
      let sumaTotal  = 0      
      let detalle = detallex.data.map((item,index)=>{
        let iok = {
        "id"           : item.articulo.id,
        "codigo"       : item.articulo.codigo,
        "nombre"       : item.articulo.nombre,
        "precioVenta"  : item.articulo.precioVenta,
        "almacen"      : item.almacen.nombre,
        "marca"        : item.articulo.marca.nombre,
        "categoria"    : item.articulo.categoria.nombre,
        "stock"        : item.stock,
        "costo"        : item.costo,
        "articuloId"   : item.articuloId
        }
        sumaTotal  = sumaTotal + parseFloat(item.articulo.precioVenta)        
      return iok;
      })
      res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal } }); 
      })
      .catch((reason) => {         
       
        res.status(400).send({ message: reason });
      });
  }

  static ticketrango(req, res) {   
    const { desde, hasta } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    TicketService.getTicketsRango(fdesde,fhasta)      
        .then((data) => {             
        res.status(200).send({message:"tickets lista", result: data });                       
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  }

  static prospectorango(req, res) {   
    const { desde, hasta } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    ProspectoService.getProspectoRango(fdesde,fhasta)      
        .then((xdata) => {    
          let resData = xdata.data.map((item,index)=>{
            let iok = {
            "id"      : item.id,   
            "fecha"   : item.fecha,
            "nombre"  : item.nombre,
            "tipo"    : item.tipo,
            "observaciones"   : item.observaciones,
            "articulo" : item.articulo.nombre            
            }            
        return iok;
        })  
        let data={
          data: resData, 
          total: xdata.total
        }
        res.status(200).send({message:"ventas lista", result: data });                       
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  }

  static cotizacionrango(req, res) {   
    const { desde, hasta } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    CotizacionService.getCotizacionRango(fdesde,fhasta)      
        .then((data) => {                              
          res.status(200).send({message:"cotizaciones lista", result: data });             
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  } 

  static clientrango(req, res) {   
    const { desde, hasta } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    ClienteService.getClientesRango(fdesde,fhasta)      
        .then((data) => {                              
          res.status(200).send({message:"clientes lista", result: data });             
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  } 

  static clientcons(req, res) {   
    const { gestion } = req.body
    Promise.all([                  
      ClienteService.getTotal(),
      CotizacionService.getTotals(gestion),            
      ProspectoService.getTotals(gestion),
      TicketService.getTotals(gestion)])
    .then(([clienteT,cotizacionT,prospectoT,ticketT]) => {         
        res.status(200).send({ result:{clienteT, cotizacionT, prospectoT, ticketT }});
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  } 


  static salecons(req, res) {   
    const { gestion } = req.body
    Promise.all([                  
            VentaService.getTotal(gestion),            
            VentaItemsService.getInformeData(gestion),            
            VentaService.getDetalleLista(gestion),
            PlanService.getItemsCobros(gestion,true),
            PlanService.getItemsCobros(gestion,false),
            PlanService.getItemCobros(gestion,true),
            PlanService.getItemCobros(gestion,false)
            
    ])
      .then(([ventaT,xventasT,yventas,irealizados, ipendientes,crealizados, cpendientes]) => { 
        let realizados = parsearMes(irealizados)
        let pendientes = parsearMes(ipendientes)
        
        let ventasLabel = []        
        let ventasItem  = []        
        xventasT.map((item,index)=>{
          ventasLabel.push(item.articulo.nombre)
          ventasItem.push(parseFloat(item.suma))
        })    
        let resVentas = parsearMes(yventas)
        res.status(200).send({ result:{ventaT,ventasLabel,ventasItem,resVentas,pendientes,realizados,crealizados, cpendientes }});
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  }

  static salerango(req, res) {   
    const { desde, hasta, estado } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    VentaService.getVentasRango(fdesde,fhasta,estado)      
        .then((data) => {          
          let montoTotal = 0;                                                
          let saldoTotal = 0;
          let pagoTotal  = 0;
          let resData = data.data.map((item,index)=>{
              let iok = {
              "id"            : item.id,   
              "fechaVenta"    : item.fechaVenta,
              "totalGeneral"  : item.totalGeneral,
              "observaciones" : item.observaciones,                  
              "cliente"       : item.cliente.nombres,
              "saldo"         : item.notacobranza.saldoTotal,                            
              "pago"          : item.notacobranza.pagoTotal
              }
              montoTotal  = montoTotal + parseFloat(item.totalGeneral)   
              pagoTotal   = pagoTotal + parseFloat(item.notacobranza.pagoTotal)   
              saldoTotal  = saldoTotal + parseFloat(item.notacobranza.saldoTotal)   
          return iok;
          })  
          res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, montoTotal: montoTotal,pagoTotal:pagoTotal,saldoTotal:saldoTotal} });             
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  } 

  static chargerango(req, res) {   
    const { estado,  desde, hasta } = req.body

    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    
    PlanService.getListaCobros(estado,fdesde,fhasta)
      .then((data) => {          
       
        let montoTotal = 0;                                                        
        let resData = data.data.map((item,index)=>{
            let iok = {
              "id"            : item.id,   
              "cuota"         : item.cuota,
              "monto"         : item.monto,
              "estado"        : item.estado,
              "fechaPago"     : item.fechaPago,
              "fechaPagado"   : item.fechaPagado ? item.fechaPagado: 'sin pago',
              "observaciones" : item.nota.detalle,
              "cliente"       : item.nota.venta.clients
            }
            montoTotal  = montoTotal + parseFloat(item.monto)               
        return iok;
        })  
        res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, montoTotal: montoTotal} });             
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  }


  static payrango(req, res) {   
    const { estado,  desde, hasta } = req.body

    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    
    PlanService.getListaPagos(estado,fdesde,fhasta)
      .then((data) => {          
       
        let montoTotal = 0;                                                        
        let resData = data.data.map((item,index)=>{
            let iok = {
              "id"            : item.id,   
              "cuota"         : item.cuota,
              "monto"         : item.monto,
              "estado"        : item.estado,
              "fechaPago"     : item.fechaPago,
              "fechaPagado"   : item.fechaPagado ? item.fechaPagado: 'sin pago',
              "observaciones" : item.nota.detalle,
              "proveedor"     : item.nota.compra.proveedors
            }
            montoTotal  = montoTotal + parseFloat(item.monto)               
        return iok;
        })  
        res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, montoTotal: montoTotal} });             
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  }

  static buycons(req, res) {   
    const { gestion } = req.body
    Promise.all([                  
            CompraService.getTotal(gestion),            
            CompraItemsService.getInformeData(gestion),            
            CompraService.getDetalleLista(gestion),
            PlanService.getItemsPagos(gestion,true),
            PlanService.getItemsPagos(gestion,false),
            PlanService.getItemPagos(gestion,true),
            PlanService.getItemPagos(gestion,false),
            
    ])
      .then(([compraT,xcomprasT,ycompras,irealizados, ipendientes,prealizados,ppendientes]) => { 
        let realizados = parsearMes(irealizados)
        let pendientes = parsearMes(ipendientes)
        
        let comprasLabel = []        
        let comprasItem  = []        
        xcomprasT.map((item,index)=>{
          comprasLabel.push(item.articulo.nombre)
          comprasItem.push(parseFloat(item.suma))
        })    
        let resCompras = parsearMes(ycompras)
        res.status(200).send({ result:{compraT,comprasLabel,comprasItem,resCompras,pendientes,realizados,prealizados,ppendientes }});
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  }
  static buyrango(req, res) {   
    const { desde, hasta, estado } = req.body
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    CompraService.getComprasRango(fdesde,fhasta,estado)      
        .then((data) => {          
          let montoTotal = 0;                                                
          let saldoTotal = 0;
          let pagoTotal  = 0;
          let resData = data.data.map((item,index)=>{
              let iok = {
              "id"            : item.id,   
              "fechaCompra"   : item.fechaCompra,
              "totalGeneral"  : item.totalGeneral,
              "observaciones" : item.observaciones,                  
              "proveedor"     : item.proveedor.razonSocial,
              "saldo"         : item.notacobranza.saldoTotal,                            
              "pago"          : item.notacobranza.pagoTotal
              }
              montoTotal  = montoTotal + parseFloat(item.totalGeneral)   
              pagoTotal   = pagoTotal + parseFloat(item.notacobranza.pagoTotal)   
              saldoTotal  = saldoTotal + parseFloat(item.notacobranza.saldoTotal)   
          return iok;
          })  
          res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, montoTotal: montoTotal,pagoTotal:pagoTotal,saldoTotal:saldoTotal} });             
        })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });

  } 

  static estadoCuentas(req,res){
      const { clienteId } = req.body
      Promise.all([VentaService.getVentasActivas(clienteId),ClienteService.getItemSingle(clienteId)])
        .then(([ventas,cliente])=>{
          let VentasTotal = 0
          let PagosTotal = 0
          let SaldoTotal = 0
          let detalle = ventas.map((itt)=>{
            let iok = {
              "id"            : itt.id,
              "ventaTotal"    : itt.total,
              "fechaVenta"    : itt.fechaVenta,
              "observaciones" : itt.observaciones,
              "cuotas"        : itt.notacobranza.cuotas,
              "tipo"          : itt.notacobranza.tipo,
              "pagoTotal"     : itt.notacobranza.pagoTotal,
              "saldoTotal"    : itt.notacobranza.saldoTotal
              }
              VentasTotal = VentasTotal + parseFloat(itt.notacobranza.montoTotal)
              PagosTotal  = PagosTotal + parseFloat(itt.notacobranza.pagoTotal)
              SaldoTotal  = SaldoTotal + parseFloat(itt.notacobranza.saldoTotal)
              return iok;
            })
          res.status(200).send({ result: { item:cliente, data:detalle, total:VentasTotal, pagos:PagosTotal, saldo:SaldoTotal } });     
        })

  }

  static cajas(req, res) {
    const { desde, hasta, usuarioId } = req.body;        
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]     
                 
    CajaService.getDetalle(fdesde,fhasta,usuarioId)
    .then((detallex) => {  
      let egreso     = 0
      let ingreso    = 0
      let sumaTotal  = 0      
      let detalle = detallex.data.map((item,index)=>{
        let iok = {
        "id"           : item.id,
        "estado"       : item.estado,
        "montoInicial" : item.montoInicial,
        "montoEgreso"  : item.montoEgreso,
        "montoIngreso" : item.montoIngreso,
        "montoFinal"   : item.montoFinal,
        "fechaCierre"  : item.fechaCierre,
        "fechaCaja"    : item.fechaCaja,
        "usuarioId"    : item.usuario.id,
        "usuario"      : item.usuario.nombres
        }
        egreso     = egreso + parseFloat(item.montoEgreso)                
        ingreso    = ingreso + parseFloat(item.montoIngreso)
        sumaTotal  = sumaTotal + parseFloat(item.montoFinal)
      return iok;
      })
      res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal, egreso:egreso, ingreso: ingreso } });       
      })
      .catch((reason) => {         
       
        res.status(400).send({ message: reason });
      });
  }
  /*
  static articulos(req, res) {   
    const { usuarioId, rolId, estado } = req.body    
      AlmacenItemsService.getInformeData(estado)
        .then((articulosT) => {        
          let articulosLabel = []        
          let articulosItem  = []                  
          console.log(articulosT)
        })      
        .catch((reason) => {
          console.log(reason)
          res.status(400).send({ message: reason });
        });       
  }


  static pagos(req, res) {
    const { desde, hasta, tipo, estado } = req.body;    

    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]     
       
    if(tipo === 'pagos')
    {
      PlanService.getDetallePagos(fdesde,fhasta,estado)
      .then((detallex) => {      
        let sumaTotal  = 0      
        let detalle = detallex.data.map((item,index)=>{
          let iok = {
          "id"          : item.id,
          "cuota"       : item.cuota,
          "monto"       : item.monto,
          "estado"      : item.estado ? 'pagado': 'pendiente',
          "fechaPago"   : item.fechaPago,
          "fechaPagado" : item.fechaPagado,
          "notaId"      : item.notaId,
          "compraId"    : item.nota.compra.id,
          "sujeto"      : item.nota.compra.proveedor.razonSocial
          }
          sumaTotal  = sumaTotal + parseFloat(item.monto)        
        return iok;
        })
        res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal } });     
      })
      .catch((reason) => {         
         
          res.status(400).send({ message: reason });
      });
    }else{
      PlanService.getDetalleCobros(fdesde,fhasta,estado)
      .then((detallex) => {      
        let sumaTotal  = 0      
        let detalle = detallex.data.map((item,index)=>{
          let iok = {
          "id"          : item.id,
          "cuota"       : item.cuota,
          "monto"       : item.monto,
          "estado"      : item.estado ? 'pagado': 'pendiente',
          "fechaPago"   : item.fechaPago,
          "fechaPagado" : item.fechaPagado,
          "notaId"      : item.notaId,
          "ventaId"     : item.nota.venta.id,
          "sujeto"      : item.nota.venta.cliente.nombres          
          }
          sumaTotal  = sumaTotal + parseFloat(item.monto)        
        return iok;
        })
        res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal } });     
      })
      .catch((reason) => {         
        
          res.status(400).send({ message: reason });
      });
    }
    
  }

  

 
  
  static general(req, res) {   
    const { desde, hasta, tipo, estado, rango, vrango } = req.body;    
    
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]

    if(tipo === "compras"){
      CompraService.getDetalle(fdesde,fhasta, estado, rango, vrango)
      .then((detallex) => {                             
        let sumaTotal  = 0
        let saldoTotal = 0
        let detalle = detallex.data.map((item,index)=>{
          let iok = {
          "id"            : item.id,   
          "fecha"         : item.fechaCompra,          
          "total"         : item.total,
          "observaciones" : item.observaciones,
          "estado"        : item.estado,
          "sujeto"        : item.proveedor.razonSocial,
          "saldo"         : item.notacobranza.saldoTotal          
          }
          sumaTotal  = sumaTotal + parseFloat(item.total)
          saldoTotal = saldoTotal + parseFloat(item.notacobranza.saldoTotal)
        return iok;
        })     
        
        res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal, saldo:saldoTotal } });
      })
      .catch((reason) => {         
      
        res.status(400).send({ message: reason });  
      });
    }else{
      VentaService.getDetalle(fdesde,fhasta, estado, rango, vrango)
      .then((detallex) => {                             
        let sumaTotal  = 0
        let saldoTotal = 0
        let detalle = detallex.data.map((item,index)=>{
          let iok = {
          "id"            : item.id,   
          "fecha"         : item.fechaVenta,          
          "total"         : item.total,
          "observaciones" : item.observaciones,
          "estado"        : item.estado,
          "sujeto"        : item.cliente.nombres,
          "saldo"         : item.notacobranza.saldoTotal          
          }
          sumaTotal  = sumaTotal + parseFloat(item.total)
          saldoTotal = saldoTotal + parseFloat(item.notacobranza.saldoTotal)
        return iok;
        })     
        
        res.status(200).send({ result: { data:detalle, total:detallex.total, suma:sumaTotal, saldo:saldoTotal } });
      })
      .catch((reason) => {         
    
        res.status(400).send({ message: reason });  
      });
    }        
  }

  static consolidado(req, res) {   
    const { usuarioId, rolId, gestion } = req.body
    Promise.all([      
            ArticuloService.getTotal(),      
            ClienteService.getTotal(),
            CompraService.getTotal(gestion),
            VentaService.getTotal(gestion),
            CompraItemsService.getInformeData(gestion),
            VentaItemsService.getInformeData(gestion),
            CompraService.getDetalleLista(gestion),
            VentaService.getDetalleLista(gestion)
            
    ])
      .then(([articulosT, clienteT,compraT,ventaT,xcomprasT,xventasT,ycompras,yventas]) => {                      
        let comprasLabel = []        
        let comprasItem  = []        
        xcomprasT.map((item,index)=>{
          comprasLabel.push(item.articulo.nombre)
          comprasItem.push(parseInt(item.suma))
        })
        let ventasT = xventasT.map((item,index)=>{
          let iok = {           
          "y"      : parseInt(item.suma),          
          "name"   : item.articulo.nombre          
          }
     
        return iok;
        }) 
        let resVentas  = parsearMes(yventas)
        let resCompras = parsearMes(ycompras)
        res.status(200).send({ result:{articulosT, clienteT,compraT,ventaT, comprasLabel,comprasItem,ventasT,resVentas,resCompras }});
      })      
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });  
     
  }

*/


}

function parsearMes(items){
  const newArray = [0,0,0,0,0,0,0,0,0,0,0,0]
  items.map((it =>{        
      switch(it.mes){
        case 1:
          newArray[0] = parseInt(it.total)        
        break;  
        case 2:
          newArray[1] = parseInt(it.total)
        break;  
        case 3:
          newArray[2] = parseInt(it.total)
          break;    
        case 4:
          newArray[3] = parseInt(it.total)
          break;
        case 5:
          newArray[4] = parseInt(it.total)
          break;
        case 6:
          newArray[5] = parseInt(it.total)
          break;
        case 7:
          newArray[6] = parseInt(it.total)
          break;
        case 8:
          newArray[7] = parseInt(it.total)
          break;
        case 9:
          newArray[8] = parseInt(it.total)
          break;
        case 10:
          newArray[9] = parseInt(it.total)
          break;                                           
        case 11:
          newArray[10] = parseInt(it.total)
          break;        
        case 12:
          newArray[11] = parseInt(it.total)
          break;
        default:
          break;
      }      
   }))
   return newArray
}
function parsear(total,items){  
  const newArray = []
  items.map((it =>{                
    let dat = {}        
    let yy = parseFloat((it.y * 100) / total).toFixed(2)    
    dat.y = parseFloat(yy)
    dat.name = it.articulo.nombre        
    newArray.push(dat)
   }))
   return newArray
}

function parse(items){
  const newArray = []
  items.map((it =>{        
 
    let dat = {}        
    dat.id = it.articuloId
    dat.cantidad = parseInt(it.y)     
    dat.nombre = it.articulo.nombre    
    newArray.push(dat)
   }))
   return newArray
}
export default InformesController;

