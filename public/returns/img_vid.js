function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState == 'loaded' || script.readyState == 'complete') {
        script.onreadystatechange = null;
        loadPlugin();
        console.log("*****THEME LOAD*****")
      }
    };
  } else {
    //Others
    script.onload = function () {
      console.log("---*****THEME LOAD*****---")
      loadPlugin();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
if (!window.jQuery) {
  loadScript(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js',
    function () {
      // jQuery loaded & load setting
      console.log('jQuery Added!!');
    }
  );
  

}
else{
  console.log("Without App jQuery!!")  
}


var loadPlugin = function() {
   $.ajax({
    method: "GET",
    url: "https://417b-202-166-171-14.ngrok.io/orders/should_show",
    data: {product_title: Shopify.checkout.line_items[0].title},
    dataType: "jsonp",
    responseType:'application/json', 
    success: function(response){
      if (response)
      {
        let body = document.createElement("body")
        for(let x = 0; x < Shopify.checkout.line_items.length; x++)
        {
          for (let step = 0; step < Shopify.checkout.line_items[x].quantity; step++){
            let container = document.createElement("object")
            body.setAttribute("id", "assistalong-reminder-body");
            body.setAttribute("style", "overflow:hidden;min-width:101%;margin-left: -5px;margin-top: 13px;")
            body.append(container)
            container.setAttribute("id","container_id")    
            container.setAttribute("type", "text/html")
            container.setAttribute("style", "height: 500px;")
            parent_product_id = Shopify.checkout.line_items[step].product_id
            options = `order_no=${$(".os-order-number").text().trim().split("#")[1]}&product_no=${x}&domain=${Shopify.shop}&parent_product_id=${parent_product_id}&product_id=${Shopify.checkout.line_items[x].product_id}&product_title=${Shopify.checkout.line_items[step].title}&product_title=${Shopify.checkout.line_items[x].title}&product_image_url=${Shopify.checkout.line_items[x].image_url}`
            container.setAttribute("data", `https://417b-202-166-171-14.ngrok.io/orders/new?${options}`)
          }   
        }
        document.getElementsByClassName("section")[0].after(body)  
      }
    },
      error: function(response)
      {
        console.log('error');
      } 
  });
}