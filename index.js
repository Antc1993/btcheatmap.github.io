
function formateo(newdata, lastPrice){

    var bookmapAsks  = []
    var bookmapBids  = []
    var bookmap = []
  
    var dateFormat= new Date(newdata['lastUpdateId']);
  
    var fecha = dateFormat.getHours()+
       ":"+dateFormat.getMinutes()+
       ":"+dateFormat.getSeconds();
  
    
    let asks = newdata['asks'];
    let bids = newdata['bids'];
 
    arregloAsks = []
    arregloBids = []
  
    orderbook = [];
    
    asks.sort()
    bids.sort()
  
    bids.forEach(element => {
   
        arregloBids.push({"fecha" : fecha, "precio": element[0], "cantidad": parseFloat(element[1])})
      
     
    });

  
    asks.forEach(element => {
     
       
      arregloAsks.push({"fecha" : fecha, "precio": element[0], "cantidad": parseFloat(element[1])})
      
    });

    arregloBids.sort()
    arregloAsks.sort()

  
  
        inicioAsks = arregloAsks[0].precio;
    
        limitAsks = arregloAsks[0].precio + 10;
          
        let bottomPrice, topPrice, limit, totalPosiciones;
        
        if(Math.floor10(arregloBids[0].precio, 1) <= Math.floor10(arregloAsks[0].precio, 1)){
            bottomPrice = Math.floor10(arregloBids[0].precio, 1);
        }else{
            bottomPrice = Math.floor10(arregloAsks[0].precio, 1);
        }
       
        
        if(Math.floor10(arregloBids[arregloBids.length-1].precio, 1) <= Math.floor10(arregloAsks[arregloAsks.length-1].precio, 1)){
            topPrice = Math.floor10(arregloAsks[arregloAsks.length-1].precio, 1);
        }else{
            topPrice = Math.floor10(arregloBids[arregloBids.length-1].precio, 1);
        }

        //console.log(bottomPrice + "--" + topPrice)
        //console.log(newdata)
       
        if(arregloBids.length > arregloAsks.length){
            totalPosiciones = arregloBids.length;
        }else{
            totalPosiciones = arregloAsks.length;
        }
        

        limitBids = Math.floor10(arregloBids[0].precio, 1);
        limitAsks = Math.floor10(arregloAsks[0].precio, 1);
        let cantidadBids = 0;
        let cantidadAsks = 0;

        pruebaBookmap = []

       
        for (let index = 0; index < totalPosiciones; index++) {
            
                let cantidadtotal;
                let BidsHabilitado = true;
                let AsksHabilitado = true;


                
                if(arregloBids.length > index){
                
                    if(arregloBids[index].precio < limitBids){
                       
                        if(arregloBids[index].cantidad > 0){
                            cantidadBids = cantidadBids + parseFloat(arregloBids[index].cantidad);
                        }
                    }else{
                       
                        bookmapBids.push({"fecha" : fecha, "precio": limitBids, "cantidad": cantidadBids, "lastPrice":Math.floor10( lastPrice[0].price, 1)});
                        cantidadBids = 0;
                        limitBids += 10;
                    }
                        
                }

          
                if(arregloAsks.length > index){
                
                    if( arregloAsks[index].precio < limitAsks){
                       
                        if(arregloAsks[index].cantidad > 0){
                            cantidadAsks = cantidadAsks + parseFloat(arregloAsks[index].cantidad);
                        }
                    }else{

                            bookmapAsks.push({"fecha" : fecha, "precio": limitAsks, "cantidad": cantidadAsks, "lastPrice": Math.floor10( lastPrice[0].price, 1)});
                            cantidadAsks = 0;
                            limitAsks += 10;
                       
                    }
                }

        }

      bookmap = bookmapBids;

      bookmapAsks.forEach(element => {
        var results = bookmap.findIndex(i => i.precio === element.precio);
        if(results >= 0)
        {
          bookmap[results].cantidad = bookmap[results].cantidad + element.cantidad

        }else{
          bookmap.push(element)
        }
      });
   
   
      return bookmap;
  
  }
  
  function formateo2(History){
  
    retornar = []
    History.forEach(elemento => {
      elemento.forEach(element => {
        
        retornar.push(element)
      });
    });
  
    return retornar;
  }

  Math.floor10 = function(value, exp) {
    return decimalAdjust('floor', value, exp);
  };

  function decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }