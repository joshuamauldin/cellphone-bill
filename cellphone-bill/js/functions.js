
// Activity Log Toggle

  $("#toggle-call-log").click(function() {
      $("#call-log").removeClass("hidden");
      $("#text-log, #data-log").addClass("hidden");
  });
  $("#toggle-text-log").click(function() {
      $("#text-log").removeClass("hidden");
      $("#call-log, #data-log").addClass("hidden");
  });
  $("#toggle-data-log").click(function() {
      $("#data-log").removeClass("hidden");
      $("#text-log, #message-log").addClass("hidden");
  });
