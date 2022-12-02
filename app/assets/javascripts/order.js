var host_url = "https://mcacao.phaedrasolutions.com"
var storedFiles = [];
var more_images_count = 0;
function handleFileSelect(e) {
  var files = e.target.files;
  var filesArr = Array.prototype.slice.call(files);
  filesArr.forEach(function(f) {
    storedFiles.push(f);
    more_images_count += 1;
  });
}

 function loadImages(event,product_size,image_type) {
  var total_file = 0;
  var max_size = 0;
  var single_max_size = 0;
  var sum = 0;
  var myList = new Array();
  total_images = document.getElementById("image_file").files.length + document.getElementById("more_image_file").files.length
  if (product_size == 6)
  {
    max_size = 512 * 1024 * 1024;
    single_max_size = 200 * 1024 * 1024; 
    if(document.getElementById("image_file").files.length > 1896 || total_images > 1896)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 1896.";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
      hide_notice('error');
      return false;
    }
  }
  else
  {
    max_size = 128 * 1024 * 1024;
    single_max_size = 100 * 1024 * 1024;
    if(document.getElementById("image_file").files.length > 640 || total_images > 640)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 640.";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
      hide_notice('error');
      return false;
    }
  }
  if (document.getElementById("more_image_file").files.length == 0)
  {
    total_file = document.getElementById("image_file").files.length;
    $('.gallery-right').addClass('show').removeClass('hide');
  } 
  else
  {
    total_file = document.getElementById("more_image_file").files.length;
    $('.gallery-right').addClass('show').removeClass('hide');
  }
  const dt = new DataTransfer()
  var input = document.getElementById('image_file');
  if (image_type == 'more_uploaded_images')
  {
    input = document.getElementById('more_image_file')
  }
  if (image_type == 'more_uploaded_images')
  {
    input = document.getElementById('more_image_file')
  }
  for(var i = 0; i < total_file; i++)
  {
    sum = sum + event.target.files[i].size;
    if (event.target.files[i].name.includes('.svg'))
    {
      if(image_type == 'uploaded_images' && i == 0 )
      {
        main_tabs();
      }
      document.getElementById("alert_message").innerHTML = event.target.files[i].name +" svg format images are not allowed";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide success-message');
      hide_notice('error');  
    }
    else if(event.target.files[i].size > single_max_size )
    {
      if(image_type == 'uploaded_images' && i == 0 )
      {
        main_tabs();
      }
      if (product_size == 4)
      {
        document.getElementById("alert_message").innerHTML = event.target.files[i].name +" size cannot be greater than 100MB.";
        $("#alert_message").addClass('alert alert-danger').removeClass('hide success-message');
        hide_notice('error');  
      }
      else
      {
        document.getElementById("alert_message").innerHTML = event.target.files[i].name +" size cannot be greater than 200MB.";
        $("#alert_message").addClass('alert alert-danger').removeClass('hide success-message');
        hide_notice('error');  
      }
    }
    else if (sum > max_size)
    {
      document.getElementById("alert_message").innerHTML = "Total images size cannot be greater than 512MB.";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide success-message');
      hide_notice('error');
      return false;
    }
    else
    {
      var imgCont = document.getElementById("preview");
      var divElm = document.createElement('div');
      divElm.id = "rowdiv" + i;
      divElm.className = 'relative'
      var spanElm = document.createElement('span');
      var image = document.createElement('img');
      image.src = URL.createObjectURL(event.target.files[i]);
      image.id = "output" + i;
      if (image_type == 'more_uploaded_images')
      {
        image.id = "output" + more_images_count;
      }
      image.width = "54";
      image.height = "54";
      image.className = 'right-color-image'
      spanElm.appendChild(image);
      var deleteImg = document.createElement('p');
      deleteImg.className = 'image-cross'
      imgp = document.createElement("IMG")
      imgp.src = document.getElementById('image_cross').src
      imgp.setAttribute("class", "cross")
      deleteImg.appendChild(imgp)
      deleteImg.onclick = function() {
        if ((document.getElementById('image_file').files.length == 1 || $("#prev_checkbox").is(':checked')) && document.getElementById('more_image_file').files.length == 1)
        {
          index = this.parentElement.getElementsByClassName('right-color-image')[0].id.replace('output','')
          index = Number(index);
          storedFiles.splice(index, 1)
        }
        else
        {
          index = this.parentNode.id.replace('rowdiv','');
          index = Number(index);
          const dt = new DataTransfer()
          var input = document.getElementById('image_file');
          if (image_type == 'more_uploaded_images')
          {
            input = document.getElementById('more_image_file')
          }
          const { files } = input
          for (let j = 0; j < files.length; j++) {
            const file = files[j]
            if (index !== j)
            {
              dt.items.add(file)
            }
          }
          input.files = dt.files
        }
        this.parentNode.remove() 
        if (document.getElementById('preview').getElementsByClassName('relative').length == 0 ) 
        {
          main_tabs();
        }
      };
      divElm.appendChild(spanElm);
      divElm.appendChild(deleteImg);
      imgCont.appendChild(divElm);
      dt.items.add(event.target.files[i])
      $('.custom-check').addClass('hide').removeClass('show');
      $('.up-images').addClass('hide').removeClass('show');
      $('.gallery-right').addClass('show').removeClass('hide');
      document.getElementById("video_file").disabled = true;
      if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
      {
        $(".right-border").addClass('hide').removeClass('show');
        $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
      }
      $(".product-list").css("padding-top","0px");
      $(".pr-item-left").addClass('next-page-left');
      $('.pr-item-right').removeClass('flex-1');
      $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
      $('.up-more').addClass('show').removeClass('hide');
      $('.remove-btn').addClass('show').removeClass('hide');
      $('.submit-btn').addClass('show').removeClass('hide');
      $(".submit-btn").css('font-size','14px');
      $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
    }
  }
  input.files = dt.files
};

function loadVideo(product_size){
  var input = document.getElementById('video_file');
  var reader = new FileReader();
  var MaxSize = 0;
  if (product_size == 6)
  {
    MaxSize = 512 * 1024 * 1024 
  }
  else
  {
    MaxSize = 128 * 1024 * 1024
  }
  if (input.files[0].size > MaxSize)
  {
    document.getElementById("alert_message").innerHTML = input.files[0].name + " is too big. Maximum size should be 512MB.";
    $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
    hide_notice('error');
    return false;
  }
  reader.readAsDataURL(input.files[0]);
    reader.onload = function()
    {
      if(document.getElementById('uploaded_video') != null && document.getElementById('uploaded_video').src != '')
      {
        document.getElementById('uploaded_video').remove();
      }
      var video = document.createElement('video');
      video.src = reader.result;
      video.id = "uploaded_video"
      video.autoplay = false;
      video.controls = true;
      video.muted = false;
      video.className = 'video-attributes';
      var uploaded_video = document.getElementById('preview_video');
      uploaded_video.appendChild(video);
      imgp = document.createElement("IMG")
      imgp.src = document.getElementById('image_cross').src
      imgp.className = "cross-single"
      imgp.onclick = function()
      {
        $('#uploaded_video').addClass('hide').removeClass('show');
        $('.cross-single').addClass('hide').removeClass('show');
        $('.up-images').addClass('show').removeClass('hide');
        $('.submit-btn').addClass('hide').removeClass('show');
        $(".pr-item-left").removeClass('next-page-left').addClass('border-padding');
        $("#preview_video").addClass('hide').removeClass('show');
        $(".custom-check").removeClass('hide');
        $("#prev_checkbox").prop("checked", false);
        $(".right-border").addClass('show').removeClass('hide');
        if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
        {
          $(".pr-item-right").addClass('btn-add-padding-top').removeClass('btn-rem-padding-top');
        }
        document.getElementById("image_file").disabled = false;
      }
      uploaded_video.appendChild(imgp);
    }
    document.getElementById("image_file").disabled = true;
    $('.up-images').addClass('hide').removeClass('show');
    $('.custom-check').addClass('hide').removeClass('show');
    $('.cross-single').addClass('show').removeClass('hide');
    $("#preview_video").addClass('show').removeClass('hide');
    $("#preview_video").addClass('preview-video-style');
    if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
    {
      $(".right-border").addClass('hide').removeClass('show');
      $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
    }
    else
    {
      $(".product-list").css("padding-top","45px")
    }
    $(".pr-item-left").addClass('next-page-left').removeClass('border-padding');
    $('.remove-btn').addClass('hide').removeClass('show');
    $('.submit-btn').addClass('show').removeClass('hide');
 }
 function info_checkbox(parent_product_id, product_id, order_no, product_no, first_product_title, product_title,product_length,variant_title){
  checkbox_value = $("#prev_checkbox").is(':checked')
  if (checkbox_value == false && $("#alert_message").hasClass('alert-danger'))
  {
    $("#alert_message").addClass('hide').remove('alert alert-danger'); 
  }
  $.ajax({
    method: "GET",
    url: `${host_url}/orders/preview_files`,
    data: {checkbox_value: checkbox_value, parent_product_id: parent_product_id, product_id: product_id, order_no: order_no, product_no: product_no,first_product_title: first_product_title,product_title: product_title,product_length: product_length,variant_title: variant_title},
    dataType: "json",
    success: function(response){
      var myList = new Array();
      if (response.image_urls != null && response.image_urls.length != 0)
      {
        for(var i=0;i<response.image_urls.length;i++)
        {
          var imgCont = document.getElementById("preview");
          var divElm = document.createElement('div');
          divElm.id = "rowdiv" + i;
          divElm.className = 'relative'
          var spanElm = document.createElement('span');
          var image = document.createElement('img');
          image.src = response.image_urls[i];
          image.id = "output" + i;
          image.width = "54";
          image.height = "54";
          image.className = 'right-color-image'
          spanElm.appendChild(image);
          var deleteImg = document.createElement('p');
          deleteImg.className = 'image-cross'
          imgp = document.createElement("IMG")
          imgp.src = document.getElementById('image_cross').src
          imgp.setAttribute("class", "cross")
          deleteImg.appendChild(imgp)
          deleteImg.onclick = function() {
            index = this.parentNode.id.replace('rowdiv','');
            index = Number(index);
            const dt = new DataTransfer()
            input = document.getElementById('preview').getElementsByClassName('relative')
            var form = $('#uploadForm')[0]
            formData = new FormData(form)
            for (let j = 0; j < input.length; j++) {
              if (index !== j)
              {
                formData.append('order[images][]', response.image_urls[j])
              }
            }
            this.parentNode.remove() 
            if (document.getElementById('preview').getElementsByClassName('relative').length == 0 ) 
            {
              $('.up-images').addClass('show').removeClass('hide');
              $('.up-more').addClass('hide').removeClass('show');
              $('.remove-btn').addClass('hide').removeClass('show');
              $('.submit-btn').addClass('hide').removeClass('show');
              $("#preview_video").addClass('hide').removeClass('show');
              document.getElementById("video_file").disabled = false;
              $('.gallery-right').addClass('hide').removeClass('show');
              $('.custom-check').removeClass('hide');
              $("#prev_checkbox").prop("checked", false);
              if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
              {
                $(".pr-item-right").addClass('btn-add-padding-top').removeClass('btn-rem-padding-top');
              }
              else
              {
                $(".product-list").css("padding-top","50px");
              }    
              $(".pr-item-left").addClass('border-padding').removeClass('next-page-left');
            }
          };
          divElm.appendChild(spanElm);
          divElm.appendChild(deleteImg);
          imgCont.appendChild(divElm);
        } 
        document.getElementById("video_file").disabled = true;
        $('.custom-check').addClass('hide').removeClass('show');
        $('.up-images').addClass('hide').removeClass('show');
        $('.gallery-right').addClass('show').removeClass('hide');
        if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
        {
          $(".right-border").addClass('hide').removeClass('show')
          $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
        }
        $(".product-list").css("padding-top","0px");
        $(".pr-item-left").addClass('next-page-left');
        $('.pr-item-right').removeClass('flex-1');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
        $('.up-more').addClass('show').removeClass('hide');
        $('.remove-btn').addClass('show').removeClass('hide');
        $('.submit-btn').addClass('show').removeClass('hide');
        $(".submit-btn").css('font-size','14px');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
      }
      else if (response.video_url != null)
      {
        document.getElementById("preview_video").style.marginRight = "55px";
        var video = document.createElement('video');
        video.src = response.video_url;
        video.id = "uploaded_video"
        video.autoplay = false;
        video.controls = true;
        video.muted = false;
        video.className = 'video-attributes';
        var uploaded_video = document.getElementById('preview_video');
        uploaded_video.appendChild(video);
        imgp = document.createElement("IMG")
        imgp.src = document.getElementById('image_cross').src
        imgp.className = "cross-single"
        imgp.onclick = function()
        {
          $('#uploaded_video').addClass('hide').removeClass('show');
          $('.cross-single').addClass('hide').removeClass('show');
          $('.up-images').addClass('show').removeClass('hide');
          $('.submit-btn').addClass('hide').removeClass('show');
          $(".pr-item-left").removeClass('next-page-left').addClass('border-padding');
          $("#preview_video").addClass('hide').removeClass('show');
          $(".custom-check").removeClass('hide');
          $("#prev_checkbox").prop("checked", false);
          $(".right-border").addClass('show').removeClass('hide');
          if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
          {
            $(".pr-item-right").addClass('btn-add-padding-top').removeClass('btn-rem-padding-top');
          }  
          document.getElementById("image_file").disabled = false;
        }
        uploaded_video.appendChild(imgp);
        document.getElementById("image_file").disabled = true;
        $('.up-images').addClass('hide').removeClass('show');
        $('.custom-check').addClass('hide').removeClass('show');
        $('.cross-single').addClass('show').removeClass('hide');
        $("#preview_video").addClass('show').removeClass('hide');
        $("#preview_video").addClass('preview-video-style');    
        if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
        {
          $(".right-border").addClass('hide').removeClass('show')
          $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
        }
        else
        {
          $(".product-list").css("padding-top","45px")
        }
        $(".pr-item-left").addClass('next-page-left').removeClass('border-padding');
        $('.remove-btn').addClass('hide').removeClass('show');
        $('.submit-btn').addClass('show').removeClass('hide');
      }
      else if(response.error_message != null)
      {
        document.getElementById("prev_checkbox").checked = false;
        document.getElementById("alert_message").innerHTML = response.error_message;
        $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
        hide_notice('error');
      }
      else
      {
        console.log('something is wrong');
      }   
      },
      error: function(response)
      {
        console.log('error');
      }
  });
 }

 function submit_form(e,order_no,user_email,product_image_url,user_name)
 {
  if ((document.getElementById('image_file').files.length == 1 || $("#prev_checkbox").is(':checked')) && document.getElementById('more_image_file').files.length == 1)
  {
    e.preventDefault();
    var form = $('#uploadForm')[0]
    var formData = new FormData(form);
    $("#uploadForm").serializeArray();
    for(var i=0, len=(storedFiles.length - 1) ; i<len; i++) {
      formData.append('order[images][]', storedFiles[i]); 
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', `${host_url}/orders`, true);
    
    xhr.onload = function(e) {
      if(this.status == 200) {
        console.log(e.currentTarget.responseText);	
        alert(e.currentTarget.responseText + ' items uploaded.');
      }
    }
    xhr.send(formData);
  }
  if (user_email != '')
  {
    $.ajax({
      method: "GET",
      url: `${host_url}/orders/send_email`,
      data: {user_email: user_email, order_no: order_no, product_image_url: product_image_url,user_name: user_name},
      dataType: "json",
      success: function(response){
      },
      error: function(response)
      {
        console.log('error');
      }
    });
  }
  $('.up-more').addClass('hide').removeClass('show');
  $('.remove-btn').addClass('hide').removeClass('show');
  $('.submit-btn').addClass('hide').removeClass('show');
  $('.cross-single').addClass('hide').removeClass('show');
  $(".cross").addClass('hide').removeClass('show')
  document.getElementById("alert_message").innerHTML = 'Submitted Successfully';
  $("#alert_message").addClass('alert alert-success').removeClass('hide alert-danger');
 }

 


function hide_notice(type)
{
  if (type == 'error')
  {
    setTimeout(function() { 
      $("#alert_message").addClass('hide').removeClass('alert alert-danger');
    }, 2000);
  }
}

 function main_tabs()
 {
  $('.up-images').addClass('show').removeClass('hide');
  $('.up-more').addClass('hide').removeClass('show');
  $('.remove-btn').addClass('hide').removeClass('show');
  $('.submit-btn').addClass('hide').removeClass('show');
  $("#preview_video").addClass('hide').removeClass('show');
  document.getElementById("video_file").disabled = false;
  $('.gallery-right').addClass('hide').removeClass('show');
  $('.custom-check').removeClass('hide');
  $("#prev_checkbox").prop("checked", false);
  if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
  {
    $(".pr-item-right").addClass('btn-add-padding-top').removeClass('btn-rem-padding-top');
  }
  else
  {
    $(".product-list").css("padding-top","50px");
  }
  $(".pr-item-left").addClass('border-padding').removeClass('next-page-left');
  $(".right-border").addClass('show').removeClass('hide');
 }