$(document).ready(function () {
  if (!($('#img_tab').hasClass('up-images')))
  {
    $('#divider').css("margin-top", "0rem");
    if (document.getElementById('prev_checkbox') != null)
    {
      document.getElementById('prev_checkbox').remove();
      $('.contain').text("");
    }
  } 
  $(".pr-item-left").addClass('next-page-left');
  $('.pr-item-right').removeClass('flex-1');
});


var loadImages = function(event,product_size) {
  var total_file = 0;
  var max_size = 0;
  var single_max_size = 0;
  var sum = 0;
  var myList = new Array();
  total_images = document.getElementById("image_file").files.length + document.getElementById("more_image_file").files.length
  if (product_size == 6)
  {
    max_size = 512 * 1024 * 1024;
    single_max_size = 270 * 1024; 
    if(document.getElementById("image_file").files.length > 1896 || total_images > 1896)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 1896.";
      $("#alert_message").addClass('alert alert-danger').removeClass('alert-success');
      hide_notice('error');
      return false;
    }
  }
  else
  {
    max_size = 128 * 1024 * 1024;
    single_max_size = 200 * 1024;
    if(document.getElementById("image_file").files.length > 640 || total_images > 640)
    {
      document.getElementById("alert_message").innerHTML = "Total images cannot be greater than 640.";
      $("#alert_message").addClass('alert alert-danger').removeClass('alert-success');
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
  for(var i=0; i<total_file; i++)
  {
    // var preview_images = document.getElementById('preview');
    // var element = document.createElement( 'img' );
    // element.id = 'file_images_' + i;
    // element.width = 100; 
    // element.height=100;
    // element.src = URL.createObjectURL(event.target.files[i]);
    // preview_images.appendChild(element);
    sum = sum + event.target.files[i].size;
    if(event.target.files[i].size > single_max_size )
    {
      document.getElementById("alert_message").innerHTML = event.target.files[i].name +" size cannot be greater than 200MB.";
      $("#alert_message").addClass('alert alert-danger').removeClass('success-message');
      hide_notice('error');
    }
    else if (sum > max_size)
    {
      document.getElementById("alert_message").innerHTML = "Total images size cannot be greater than 512MB.";
      $("#alert_message").addClass('alert alert-danger').removeClass('success-message');
      hide_notice('error');
      return false;
    }
    else
    {
      myList.push($('#preview').append("<img class='file_images'src='"+URL.createObjectURL(event.target.files[i])+"' width='54px' height='54px' object-fit='cover'>"));
      $('.file_images').addClass('right-color-image');
      // $('#preview').append('<span id="remove" class="close" onclick="remove_images()">&times;</span>');  
    }
  }
  $('#divider').css("margin-top", "0rem");  
  $(".pr-item-left").addClass('next-page-left');
  $('.pr-item-right').removeClass('flex-1');
  $('.gallery-right').addClass('show').removeClass('hide');
  $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
  document.getElementById("video_file").disabled = true;
  $('.up-images').addClass('hide').removeClass('show');
  $('.up-more').addClass('show').removeClass('hide');
  $('.upload-more').addClass('hide').removeClass('show');
  $('.remove-btn').addClass('show').removeClass('hide');
  $('.custom-check').addClass('hide').removeClass('show');
  $('.submit-btn').addClass('show').removeClass('hide');
  $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
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
    $("#alert_message").addClass('alert alert-danger').removeClass('alert-success');
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
      document.getElementById("preview_video").style.marginRight = "55px";
      var video = document.createElement('video');
      video.src = reader.result;
      video.id = "uploaded_video"
      video.autoplay = false;
      video.controls = true;
      video.muted = false;
      video.height = 150;
      video.width = 150;
      var uploaded_video = document.getElementById('preview_video');
      uploaded_video.appendChild(video);
    }
    $('#divider').css("margin-top", "4rem");
    $(".delete").addClass('delete_vid');
    document.getElementById("image_file").disabled = true;
    $("#extra_btns").removeClass('up-btns').addClass('video-up-btns');
    $('.up-images').addClass('hide').removeClass('show');
    $('.up-more-image').remove();
    $('.up-more-video').addClass('show').removeClass('hide');
    $('.custom-check').addClass('hide').removeClass('show');
    $('.remove-btn').remove();
    $('#remove').addClass('show').removeClass('hide');
    $('.submit-btn').addClass('show').removeClass('hide');
 }
 function info_checkbox(parent_product_id, product_id, order_no){
  checkbox_value = $("#prev_checkbox").is(':checked')
  if (checkbox_value == false && $("#alert_message").hasClass('alert-danger'))
  {
    $("#alert_message").addClass('hide').remove('alert alert-danger'); 
  }
  $.ajax({
    method: "GET",
    url: "https://mcacao.phaedrasolutions.com/orders/preview_files",
    data: {checkbox_value: checkbox_value, parent_product_id: parent_product_id, product_id: product_id, order_no: order_no},
    dataType: "json",
    success: function(response){
      var myList = new Array();
      if (response.image_urls != null && response.image_urls.length != 0)
      {
        for(var i=0;i<response.image_urls.length;i++)
        {
          myList.push($('#preview').append("<img class='file_images'src='"+response.image_urls[i]+"' width='54px' height='54px' object-fit='cover'>"));
          $('.file_images').addClass('right-color-image');
        } 
        $(".custom-check").addClass('hide').removeClass('show');
        $('#divider').css("margin-top", "0rem");  
        $(".pr-item-left").addClass('next-page-left');
        $('.pr-item-right').removeClass('flex-1');
        $('.gallery-right').addClass('show').removeClass('hide');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show');
        document.getElementById("video_file").disabled = true;
        $('.up-images').addClass('hide').removeClass('show');
        $('.up-more').addClass('show').removeClass('hide');
        $('.upload-more').addClass('hide').removeClass('show');
        $('.remove-btn').addClass('show').removeClass('hide');
        $('.submit-btn').addClass('show').removeClass('hide');
        $('.submit-btn.upload-btn').addClass('hide').removeClass('show'); 
      }
      else if (response.video_url != null)
      {
        document.getElementById("preview_video").style.marginRight = "80px";
        var video = document.createElement('video');
        video.src = response.video_url;
        video.id = "uploaded_video"
        video.autoplay = false;
        video.controls = true;
        video.muted = false;
        video.height = 150;
        video.width = 150;
        var uploaded_video = document.getElementById('preview_video');
        uploaded_video.appendChild(video);
        $('#divider').css("margin-top", "4rem");
        $(".custom-check").addClass('hide').removeClass('show');
        $(".delete").addClass('delete_vid');
        $("#extra_btns").removeClass('up-btns').addClass('video-up-btns');
        $('.up-images').addClass('hide').removeClass('show');
        $('.up-more-image').remove();
        $('.up-more-video').addClass('show').removeClass('hide');
        $('.remove-btn').remove();
        $('#remove').addClass('show').removeClass('hide');
        $('.submit-btn').addClass('show').removeClass('hide');
      }
      else if(response.error_message != null)
      {
        document.getElementById("alert_message").innerHTML = response.error_message;
        $("#alert_message").addClass('alert alert-danger').removeClass('alert-success');
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

 function submit_form()
 {
  var form = $('#uploadForm')[0];
  var formData = new FormData(form);
  if (document.getElementById("more_image_file")!= undefined && document.getElementById("more_image_file").files.length != 0)
  {
    image_files = document.getElementById("image_file").files;
    total_file = image_files.length;
    for(var i=0; i<total_file; i++)
    {
      formData.append('order[images][]', image_files[i])
    }
  }
  document.getElementById("alert_message").innerHTML = 'Submitted Successfully';
  $("#alert_message").addClass('alert alert-success').removeClass('alert-danger');
  hide_notice('success');
 }

 function remove_images(){
  $('#file_images').remove();
  $('#remove').remove();
  if ($('#image_file').val() == '')
  {
    if ($("#more_image_file").val() == '')
    {
      $('.up-images').addClass('show').removeClass('hide');
      $('.up-more-image').addClass('hide').removeClass('show');
      $('.remove-btn').addClass('hide').removeClass('show');
      $('.custom-check').addClass('hide').removeClass('show');
      $('.submit-btn').addClass('hide').removeClass('show');  
    }
  }
}

function remove_video()
{
  $('#uploaded_video').remove();
  $('#remove').remove();
  $('.up-images').addClass('show').removeClass('hide');
  $('.video-up-btns').addClass('hide').removeClass('show');
}

function hide_notice(type)
{
  if (type == 'error')
  {
    setTimeout(function() { 
      $("#alert_message").addClass('hide').removeClass('alert alert-danger');
    }, 5000);
  }
  else if (type == 'success')
  {
    setTimeout(function() { 
      $("#alert_message").addClass('hide').removeClass('alert alert-success');
    }, 5000);
  }
}