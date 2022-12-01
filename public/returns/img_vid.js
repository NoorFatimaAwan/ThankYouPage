(function() {


  console.log('hellooooo');

  var loadPlugin = function() {
    const variant_titles = []
    const substring = 'expressio'
    for(let x = 0; x < Shopify.checkout.line_items.length; x++){
      variant_titles.push((Shopify.checkout.line_items[x].title).includes(substring))
    }
    if (variant_titles.every(Boolean))
    {
      fetch("",{mode: "no-cors"})
          .then(response => response)
          .then(data => {
            if (true)
            {
              let body = document.createElement("body")
              for(let x = 0; x < Shopify.checkout.line_items.length; x++)
              {
                for (let step = 0; step < Shopify.checkout.line_items[x].quantity; step++){
                  let container = document.createElement("object")
                  body.setAttribute("id", "assistalong-reminder-body");
                  body.append(container)
                  container.setAttribute("id","thank_you_container")    
                  if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
                  {
                    container.setAttribute("style","min-height: 476px; border-bottom:1px solid #7a5e4679;");
                  }
                  else
                  {
                    container.setAttribute("style","min-height: 330px; border-bottom:1px solid #7a5e4679;");
                  }
                  body.setAttribute("style","min-height: 330px;border: 1px solid #7A5E464D; border-radius: 4px; margin-top: 30px; border-bottom: 0;" ) 
                  container.setAttribute("type", "text/html")
                  length = Shopify.checkout.line_items.length + Shopify.checkout.line_items[x].quantity
                  if (Shopify.checkout.line_items[step] != undefined)
                  {
                    parent_product_id = Shopify.checkout.line_items[step].product_id
                  }
                  else
                  {
                    parent_product_id = Shopify.checkout.line_items[x].product_id
                  }
                  options = `first_product_title=${Shopify.checkout.line_items[0].title}&product_no=${step}&order_no=${document.getElementsByClassName('os-order-number')[0].innerText.trim().split("#")[1]}&product_length=${length}&domain=${Shopify.shop}&parent_product_id=${parent_product_id}&product_id=${Shopify.checkout.line_items[x].product_id}&product_title=${Shopify.checkout.line_items[x].title}&product_image_url=${Shopify.checkout.line_items[x].image_url}&user_email=${Shopify.checkout.email}&variant_title=${Shopify.checkout.line_items[x].variant_title}`
                  container.setAttribute("data", `https://mcacao.phaedrasolutions.com/orders/new?${options}`)
                  document.getElementsByClassName("section")[0].after(body)  
                }   
              }
            }
    
      });
    }


  }

  loadPlugin();
})();


