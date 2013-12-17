(function($) {
Drupal.behaviors.flickrbrowser = {
attach: function (context, settings) {
  // Get the flickr api key from drupal settings
  api_key = $(Drupal.settings.flickrbrowser);

  // When the select list is changed grab the photos and display them to the user
  $('.flickrbrowser select').change(function() {
      var $clicked = $(this);
      $clicked.parents('.flickrbrowser').find('.photo-selector').empty();

      if ($clicked.val() != "") {
        $.getJSON("http://api.flickr.com/services/rest/?jsoncallback=?", { // flickr json call
          method: "flickr.photosets.getPhotos",
          photoset_id: $clicked.val(), // ID of the photoset
          extras: "url_sq",
          format: "json",
          api_key: api_key[0].api_key // API key from Drupal.settings
        }, function(data) {
          var photos = '<ul id="' + data.photoset.id + '" class="photos">';
          $.each(data.photoset.photo, function (i, item) {
            photos += '<li><img id="' + item.id + '" src="' + item.url_sq + '" title="' + item.title + '"/></li>';
            //$("<img/>").attr("src", item.url_sq).appendTo($(this).parents('.flickrbrowser').find('.photo-selector'));
          });
          photos += '</ul>';
          $clicked.parents('.flickrbrowser').find('.photo-selector').append(photos); // Add the photos to the selector div
          $clicked.parents('.flickrbrowser').find('ul.photos').quickPager({pageSize: 20}); // Initialize the quickPager
        });
      }
   });
   
  // When the remove link is clicked, unset the photo id, hide the link and show the browser
  $('.flickrbrowser-wrapper .photo-remove a.remove-selected').click(function() {
    var $parent = $(this).parents('.flickrbrowser-wrapper');
    $parent.find('.flickr-id').attr('value', '');
    $parent.find('.photo-selected').empty();
    $parent.find('.photo-remove').hide();
    $parent.find('.flickrbrowser').show();
    $parent.find('.flickrbrowser select').val('');
  });
 
  // When an image is clicked update the hidden id value and remove all the other images
  $('.photo-selector ul.photos img').live('click', function() {
      var $clicked = $(this);
      var $parent = $(this).parents('.flickrbrowser-wrapper');
      var id = $(this).attr('id');
      $parent.find('.flickr-id').attr('value', id);
      $parent.find('.photo-selector').empty();
      $parent.find('.photo-selected').empty().append($("<img/>").attr('src', $clicked.attr('src')).attr('title', $clicked.attr('title')));
      $parent.find('.photo-remove').show();
      $parent.find('.flickrbrowser').hide();
  });
}
};
})(jQuery);
