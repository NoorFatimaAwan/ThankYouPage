var host_url = "https://mcacao.phaedrasolutions.com"
var storedFiles = [];
var storedVideoFiles = [];
var deleted_upload_files = 0;
var deleted_more_upload_files = 0;
var image_blob_file = [];
var error_shown = true;
var more_files_count = 0;
$(document).ready(function () {
  if (!($('#img_tab').hasClass('up-images')))
  {
    if (document.getElementById('prev_checkbox') != null)
    {
      document.getElementById('prev_checkbox').remove();
      $('.contain').text("");
    }
    $(".product-list").css("padding-top","0px");
    if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
    {
      $(".pr-item-left").removeClass('next-page-left')
    }
    else
    {
      $(".pr-item-left").addClass('next-page-left').removeClass('border-padding');
    }
  } 
  if ($('#search_field').val() != '')
  {
    $('.cross-search').addClass('show').removeClass('hide')
  }
  document.querySelectorAll('#more_image_file,#more_video_file');

});

document.addEventListener('change', function(e) {
  if (e.target.matches('#more_image_file,#more_video_file'))
  {
    if ($('#loader').is(':visible'))
    {
      error_shown = true;
    }
    else
    {
      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      filesArr.forEach(function(f) {
        storedFiles.push(f);
        more_files_count += 1;
      });
    }
  }
  if (error_shown == false)
  {
    $("#submit_button").trigger('click')
  }
});

 function loadImages(event,product_size,image_type,product_no,order_id,product_id) {
  var total_file = 0;
  var max_size = 0;
  var single_max_size = 0;
  var sum = 0;
  var myList = new Array();
  image_file = document.getElementById("image_file").files
  more_image_file = document.getElementById("more_image_file").files
  total_images = image_file.length + more_image_file.length
  if (product_size == 6)
  {
    max_size = 512 * 1000 * 1000;
    single_max_size = 200 * 1000 * 1000; 
    if(image_file.length > 1896 || total_images > 1896)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 1896.";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
      hide_notice('error');
      return false;
    }
  }
  else
  {
    max_size = 128 * 1000 * 1000;
    single_max_size = 100 * 1000 * 1000;
    if(image_file.length > 640 || total_images > 640)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 640.";
      $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
      hide_notice('error');
      return false;
    }
  }
  if (more_image_file.length == 0)
  {
    total_file = image_file.length;
    $('.gallery-right').addClass('show').removeClass('hide');
  } 
  else
  {
    total_file = more_image_file.length;
    $('.gallery-right').addClass('show').removeClass('hide');
  }
  const dt = new DataTransfer()
  var input = document.getElementById('image_file');
  if (image_type == 'more_uploaded_images')
  {
    input = document.getElementById('more_image_file')
  }
  if ($('#loader').is(':visible'))
  {
    alert('Please wait for submission of already uploaded images');
    error_shown = true;
  }
  else
  {
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
          alert(event.target.files[i].name + "size cannot be greater than 100MB.")
        }
        else
        {
          alert(event.target.files[i].name + "size cannot be greater than 200MB.")
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
        error_shown = false;
        var imgCont = document.getElementById("preview");
        var divElm = document.createElement('div');
        divElm.id = "rowdiv" + i;
        divElm.className = 'relative'
        var spanElm = document.createElement('span');
        var image = document.createElement('img');
        image.src = URL.createObjectURL(event.target.files[i]);
        image.id = "output" + event.target.files[i].name;
        if (more_files_count > 0)
        {
          image.id = "output" + storedFiles[i].name;
        }
        image.width = "53";
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
          this.parentNode.remove();
          index = this.parentElement.getElementsByClassName('right-color-image')[0].id.replace('output','')
          image_file_length = image_file.length
          image_more_file_length = more_image_file.length
          if (image_type.includes('more'))
          {
            if (deleted_more_upload_files > 0)
            {
              image_more_file_length = more_image_file.length - deleted_more_upload_files
            }
          }
          else if (deleted_upload_files > 0)
          {
            image_file_length = image_file.length - deleted_upload_files
          }
          delete_assets(index,product_no,order_id,product_id,image_file_length,image_more_file_length,image_type)
          if (document.getElementById('preview').getElementsByClassName('relative').length == 0 ) 
          {
            main_tabs();
          }
        };
        divElm.appendChild(spanElm);
        divElm.appendChild(deleteImg);
        imgCont.appendChild(divElm);
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
        $(".right-border").addClass('hide').removeClass('show');
        $('.pr-item-right').addClass('hide').removeClass('show');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
        $('.up-more').addClass('show').removeClass('hide');
        $('.remove-btn').addClass('show').removeClass('hide');
      }
    }
  }
};

function loadVideo(event,product_size,product_no,order_id,product_id,video_type){
  video_file = document.getElementById('video_file').files 
  more_video_file = document.getElementById('more_video_file').files
  sum = 0;
  var input = document.getElementById('video_file');
  if (more_video_file.length != 0)
  {
    input = document.getElementById('more_video_file')
  }
  var reader = new FileReader();
  var MaxSize = 0;
  if (product_size == 6)
  {
    MaxSize = 512 * 1000 * 1000 
    error_msg = input.files[0].name + " is too big. Maximum size should be 512MB."
  }
  else
  {
    MaxSize = 128 * 1000 * 1000
    error_msg = input.files[0].name + " is too big. Maximum size should be 128MB."
  }
  if (input.files[0].size > MaxSize)
  {
    error_shown = true;
    document.getElementById("alert_message").innerHTML = error_msg;
    $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
    hide_notice('error');
    main_tabs();
    return false;
  }
  $('.gallery-right').addClass('show').removeClass('hide');
  const dt = new DataTransfer()
  if ($('#loader').is(':visible'))
  {
    alert('Please wait for submission of already uploaded videos');
    error_shown = true;
  }
  else
  {
    for(var i = 0; i < input.files.length; i++)
    {
      sum = sum + event.target.files[i].size;
      if (sum > MaxSize)
      {
        if (product_size == 4)
        {
          alert(event.target.files[i].name + "size cannot be greater than 128MB.")
        }
        else
        {
          alert(event.target.files[i].name + "size cannot be greater than 512MB.")
        }
        if ($('#loader').is(':visible'))
        {
            $('#loader').hide()
        }
        input.files = dt.files
        return false;
      }
      else 
      {
        dt.items.add(input.files[i])
        error_shown = false;
        var vidCont = document.getElementById("preview_video");
        var divElm = document.createElement('div');
        divElm.id = "rowdiv" + i;
        divElm.className = 'relative'
        var spanElm = document.createElement('span');
        var video = document.createElement('video');
        video.src = URL.createObjectURL(event.target.files[i]);
        video.width = "53";
        video.height = "54";
        video.id = "uploaded_video" + event.target.files[i].name
        if (more_files_count > 0)
        {
          video.id = "uploaded_video" + storedFiles[i].name;
        }
        video.autoplay = false;
        video.controls = true;
        video.muted = false;
        video.className = 'right-color-image'
        spanElm.appendChild(video);
        var deleteImg = document.createElement('p');
        deleteImg.className = 'image-cross'
        imgp = document.createElement("IMG")
        imgp.src = document.getElementById('image_cross').src
        imgp.setAttribute("class", "cross")
        deleteImg.onclick = function() 
        {
          this.parentNode.remove();
          index = this.parentElement.getElementsByClassName('right-color-image')[0].id.replace('uploaded_video','')
          video_file_length = video_file.length
          video_more_file_length = more_video_file.length
          if (video_type.includes('more'))
          {
            if (deleted_more_upload_files > 0)
            {
              video_more_file_length = more_video_file.length - deleted_more_upload_files
            }
          }
          else if (deleted_upload_files > 0)
          {
            video_file_length = video_file.length - deleted_upload_files
          }
          delete_assets(index,product_no,order_id,product_id,video_file_length,video_more_file_length,video_type)
          if (document.getElementById('preview_video').getElementsByClassName('relative').length == 0 ) 
          {
            main_tabs();
          }
        };
        deleteImg.appendChild(imgp)
        divElm.appendChild(spanElm);
        divElm.appendChild(deleteImg);
        vidCont.appendChild(divElm);
        document.getElementById("image_file").disabled = true;
        $('.up-images').addClass('hide').removeClass('show');
        $('.custom-check').addClass('hide').removeClass('show');
        $('.cross-single').addClass('show').removeClass('hide');
        $(".right-border").addClass('hide').removeClass('show');
        $("#preview_video").addClass('show').removeClass('hide');
        $("#preview_video").addClass('preview-video-style');
        $('.remove-btn').addClass('show').removeClass('hide');
        $('.submit-btn.upload-btn').addClass('show').removeClass('hide');
        $('.submit-btn.upload-btn').addClass('upload-video');
        if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
        {
          $(".right-border").addClass('hide').removeClass('show');
          $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
        }
        else
        {
          $(".product-list").css("padding-top","0px")
        }
        $(".pr-item-left").addClass('next-page-left').removeClass('border-padding');
      } 
    }
  }
  
 }
 function info_checkbox(parent_product_id, product_id, order_no, product_no, first_product_title, product_title,product_length,variant_title,order_id){
  checkbox_value = $("#prev_checkbox").is(':checked')
  if (checkbox_value == false && $("#alert_message").hasClass('alert-danger'))
  {
    $("#alert_message").addClass('hide').remove('alert alert-danger'); 
  }
  $.ajax({
    method: "GET",
    url: `${host_url}/orders/preview_files`,
    data: {checkbox_value: checkbox_value, parent_product_id: parent_product_id, product_id: product_id, order_no: order_no, product_no: product_no,first_product_title: first_product_title,product_title: product_title,product_length: product_length,variant_title: variant_title,order_id: order_id},
    dataType: "json",
    success: function(response){
      var myList = new Array();
      if (response.assets_urls != null && response.assets_urls.length != 0 && response.file_type == 'image')
      {
        image_file = document.getElementById('image_file').files
        for(var i=0;i<response.assets_urls.length;i++)
        {
          var imgCont = document.getElementById("preview");
          var divElm = document.createElement('div');
          divElm.id = "rowdiv" + i;
          divElm.className = 'relative'
          var spanElm = document.createElement('span');
          var image = document.createElement('img');
          image.src = response.assets_urls[i];
          image.id = "output" + response.assets_blobs[i].filename;
          image.width = "53";
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
            this.parentNode.remove();
            length_image_file = document.getElementById('preview').getElementsByClassName('relative').length - document.getElementById('more_image_file').files.length
            index = this.parentElement.getElementsByClassName('right-color-image')[0].id.replace('output','')
            delete_assets(index,product_no,order_id,product_id,length_image_file,document.getElementById('more_image_file').files.length,'uploaded_images')
            if (document.getElementById('preview').getElementsByClassName('relative').length == 0 ) 
            {
              $('.up-images').addClass('show').removeClass('hide');
              $('.up-more').addClass('hide').removeClass('show');
              $('.remove-btn').addClass('hide').removeClass('show');
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
                $(".product-list").css("padding-top","0px");
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
        $(".right-border").addClass('hide').removeClass('show');
        $('.pr-item-right').removeClass('flex-1');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
        $('.up-more').addClass('show').removeClass('hide');
        $('.remove-btn').addClass('show').removeClass('hide');
        $("#submit_button").trigger('click')
      }
      else if (response.assets_urls != null && response.assets_urls.length != 0 && response.file_type == 'video')
      {
        $("#preview_video").addClass('show').removeClass('hide');
        for(var i=0;i<response.assets_urls.length;i++)
        {
          $('.gallery-right').addClass('show').removeClass('hide');
          var vidCont = document.getElementById("preview_video");
          var divElm = document.createElement('div');
          divElm.id = "rowdiv" + i;
          divElm.className = 'relative'
          var spanElm = document.createElement('span');
          var video = document.createElement('video');
          video.src = response.assets_urls[i];
          video.width = "53";
          video.height = "54";
          video.id = "uploaded_video" + response.assets_blobs[i].filename
          video.autoplay = false;
          video.controls = true;
          video.muted = false;
          video.className = 'right-color-image'
          spanElm.appendChild(video);
          var deleteImg = document.createElement('p');
          deleteImg.className = 'image-cross'
          imgp = document.createElement("IMG")
          imgp.src = document.getElementById('image_cross').src
          imgp.setAttribute("class", "cross")
          deleteImg.onclick = function() 
          {
            this.parentNode.remove();
            index = this.parentElement.getElementsByClassName('right-color-image')[0].id.replace('uploaded_video','')
            if (deleted_upload_files > 0)
            {
              index -=1
            }
            delete_assets(index,product_no,order_id,product_id,document.getElementById('video_file').files.length,document.getElementById('more_video_file').files.length,'uploaded_videos')    
            if (document.getElementById('preview_video').getElementsByClassName('relative').length == 0 ) 
            {
              main_tabs()
            }
          };
          deleteImg.appendChild(imgp)
          divElm.appendChild(spanElm);
          divElm.appendChild(deleteImg);
          vidCont.appendChild(divElm);
        }
        document.getElementById("image_file").disabled = true;
        $('.up-images').addClass('hide').removeClass('show');
        $(".right-border").addClass('hide').removeClass('show');
        $('.custom-check').addClass('hide').removeClass('show');
        $('.cross-single').addClass('show').removeClass('hide');
        $('.remove-btn').addClass('show').removeClass('hide');
        $("#preview_video").addClass('preview-video-style');    
        $('.submit-btn.upload-btn').addClass('show').removeClass('hide');
        $('.submit-btn.upload-btn').addClass('upload-video');
        if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
        {
          $(".right-border").addClass('hide').removeClass('show')
          $(".pr-item-right").addClass('btn-rem-padding-top').removeClass('btn-add-padding-top');
        }
        else
        {
          $(".product-list").css("padding-top","0px")
        }
        $(".pr-item-left").addClass('next-page-left').removeClass('border-padding');
        $("#submit_button").trigger('click')
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
        console.log(response.generic_error);
      }   
      },
      error: function(response)
      {
        console.log('error');
      }
  });
 }

 function submit_form(e,order_no,user_email,product_image_url,user_name,thank_you_page_url,order_id,total_products,product_index,product_length)
 {
  var spinner = $('#loader');
  spinner.show();
  $(".remove-btn").attr("disabled", true);
  document.getElementsByTagName('a')[0].removeAttribute('href');
  $('.image-cross').hide();
  e.preventDefault();
  var form = $('#uploadForm')[0]
  var formData = new FormData(form);
  uploaded_files = document.getElementById("image_file").files
  file_length = uploaded_files.length
  more_uploaded_files = document.getElementById("more_image_file").files
  more_file_length = more_uploaded_files.length
  files_in_form_data = "order[images][]"
  if ((document.getElementById("video_file").files.length != 0 || $("#prev_checkbox").is(':checked')) && document.getElementById("more_video_file").files.length != 0)
  {
    uploaded_files = document.getElementById("video_file").files
    file_length = uploaded_files.length
    more_uploaded_files = document.getElementById("more_video_file").files
    more_file_length = more_uploaded_files.length
    files_in_form_data = "order[videos][]"
    formData.delete("order[images][]");
  }
  else if ((document.getElementById("image_file").files.length != 0 || $("#prev_checkbox").is(':checked')) && document.getElementById("more_image_file").files.length != 0)
  {
    formData.delete("order[videos][]");
  }
  length = more_file_length
  if (storedFiles.length > length)
  {
    for(var i= 0, len=(storedFiles.length) ; i<len; i++) {
      if (more_uploaded_files[0] != storedFiles[i] && storedFiles[i] != undefined)
      {
        formData.append(files_in_form_data, storedFiles[i]);
      } 
    }  
  }
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `${host_url}/orders`, true);
  
  xhr.onload = function(e) {
    spinner.hide();
    if(this.status == 200) {
      document.getElementById("alert_message").innerHTML = 'Submitted Successfully';
      $("#alert_message").addClass('alert alert-success').removeClass('hide alert-danger');
    }
    else
    {
      document.getElementById("video_file").disabled = false;
      document.getElementById("image_file").disabled = false;
      document.getElementById("alert_message").innerHTML = 'Order did not submit. Please try again';
      $("#alert_message").addClass('alert alert-danger').removeClass('hide alert-success');
    }
    $(".remove-btn").attr("disabled", false);
    $("a").prop("href", "");
    $('.image-cross').show();  
  }
  if (user_email != '')
  {
    formData.append('user_email', user_email)
    formData.append('order_no', order_no)
    formData.append('product_image_url', product_image_url)
    formData.append('user_name', user_name)
    formData.append('thank_you_page_url', thank_you_page_url)
    formData.append('order_id', order_id)
    formData.append('total_products', total_products)
    formData.append('product_index', product_index)
    formData.append('product_length', product_length)
  }
  xhr.send(formData);
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
  $("#preview_video").addClass('hide').removeClass('show');
  document.getElementById("video_file").disabled = false;
  document.getElementById("image_file").disabled = false;
  $('.gallery-right').addClass('hide').removeClass('show');
  $('.custom-check').removeClass('hide');
  $("#prev_checkbox").prop("checked", false);
  $(".submit-btn.upload-btn.upload-video").addClass('hide').removeClass('show');
  if (navigator.userAgent.match(/android|iphone|kindle|ipad/i) != null)
  {
    $(".pr-item-right").addClass('btn-add-padding-top').removeClass('btn-rem-padding-top');
  }
  else
  {
    $(".product-list").css("padding-top","25px");
  }
  $(".pr-item-left").addClass('border-padding').removeClass('next-page-left');
  $(".right-border").addClass('show').removeClass('hide');
 }

  function cross_show()
  {
    if ($('#search_field').val() != '')
    {
      $('.cross-search').addClass('show').removeClass('hide')
    }
    else
    {
      $('.cross-search').addClass('hide').removeClass('show')
    }
  }

  function delete_assets(index,product_no,order_id,product_id,asset_length,more_asset_length,asset_type)
  {
    $("#alert_message").addClass('hide').removeClass('alert alert-success');
    document.getElementsByTagName('a')[0].removeAttribute('href');
    if (!$('#loader').is(':visible'))
    {
      $.ajax({
        method: "GET",
        url: `${host_url}/orders/delete_assets`,
        data: {index: index, product_no: product_no, order_id: order_id,product_id: product_id,asset_length: asset_length,more_asset_length: more_asset_length,asset_type: asset_type},
        dataType: "json",
        success: function(response){
          if (response.deleted == 'removed_all')
          {
            assets = document.getElementById('preview').getElementsByClassName('relative')
            assets_length = document.getElementById('image_file').files.length +  document.getElementById('more_image_file').files.length
            if (assets.length == 0)
            {
              assets = document.getElementById('preview_video').getElementsByClassName('relative')
              assets_length = document.getElementById('video_file').files.length +  document.getElementById('more_video_file').files.length
            }
            document.getElementById("image_file").value = ""
            document.getElementById("more_image_file").value = ""
            document.getElementById("video_file").value = ""
            document.getElementById("more_video_file").value = ""
            storedFiles = [];
            more_files_count = 0
            if (assets_length == 0)
            {
              assets_length = assets.length
            }
            if (assets.length > 0)
            {
              for (var i = 0; i < assets_length; i++)
              {
                if (i >= assets.length)
                {
                  i = 0
                }
                if (assets[i] == undefined)
                {
                  break;
                }
                assets[i].remove()
              }
            }
            main_tabs()
          }
          else if (response.asset_type.includes('more'))
          {
            deleted_more_upload_files += 1;
          }
          else
          {
            deleted_upload_files += 1;
          } 
        },
        error: function(response)
        {
          console.log('error');
        }
      });  
    }
  }