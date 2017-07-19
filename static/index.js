
var USE_CACHED_IMAGE_FEATURES = false;
var file_arr = ['images (17).jpg', 'images (20).jpg', 'images (21).jpg', 'images (23).jpg', 'images (29).jpg', 'images (30).jpg', 'images (46).jpg', 'images (51).jpg', 'images (56).jpg', 'images (71).jpg', 'images (73).jpg', 'images (82).jpg', 'images (87).jpg', 'images (90).jpg', 'images (94).jpg', 'pant0.jpg', 'pant1.jpg', 'pant2.jpg', 'pant3.jpg', 'pant4.jpg', 'pant5.jpg', 'pant6.jpg', 'pant7.jpg', 'pant8.jpg', 'pant9.jpg', 'Z.jpg'];

//$.ajax({
//  url: "/static/img",
//  success: function(data){
//     $(data).find("a:contains(.jpg)").each(function(){
//        // will loop through 
//        var images = $(this).attr("href");
//        console.log(images)
//
 //       $('<p></p>').html(images).appendTo('a div of your choice')
//
//     });
//  }
//});

var num_photos = file_arr.length;
console.log(num_photos)


if (!USE_CACHED_IMAGE_FEATURES) {
    var image_features = {};

    // query the sever
    $.ajax({
        type: 'GET',
        url: '/get_img_features',
        success: function(data){
            image_features = data;
            $('.loader').hide();
            update_view(file_arr);
        }
    });
} 
//image_features is already pre-loaded
//else {
//    $('.loader').hide();
//    update_view(file_arr);
//}

// sort images
$(document).on('click', '.thumb', function(event) {
    selected_file_path = event.target.src;
    selected_file = selected_file_path.split("/")[selected_file_path.split("/").length-1];

    // calculate the euclidian distance
    eucl_dist = [];
    for (var i = 0; i<[num_photos]; i++){
        cur_file = file_arr[i];
        if (cur_file != selected_file){
            eucl_dist.push([cur_file, euclidean_dist(image_features[cur_file], image_features[selected_file])]);    
        }
    }

    // sort the files from smallest to largest by the euclidian distance
    eucl_dist.sort(function(a, b){return a[1]-b[1]});
    new_file_arr = [selected_file];
    for (var i = 0; i<eucl_dist.length; i++) {
        new_file_arr.push(eucl_dist[i][0]);
    }

    // update the view with the computed image ranking
    update_view(new_file_arr);
});


function update_view(new_file_array) {
    console.log("updating view");
    // remove images
    $(".img_section_wrapper img").remove();
    // update the global file array
    file_arr = new_file_array;
    // load the new images in the new_file_array
    for (var i = 0; i < num_photos; i++) {
        console.log(file_arr[i])
        $('.img_section_wrapper').append('<img src="/img/' + file_arr[i]+ '" class="thumb"/>');
    }
}

// Returns the euclidian distance
function euclidean_dist(a,b) {
    var dist = 0;
    for (var i = 0; i<a.length; i++) {
        dist += Math.pow(a[i] - b[i],2);
    }
    return Math.sqrt(dist);
}