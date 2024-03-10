library(mirt)
library(plumber)

#* @apiTitle MIRT IRT API
#* @apiDescription API for performance IRT with 'mirt' packgage

#* @post /estimate_difficulty
function(data) {
  # LOAD DATA FROM REQUEST BODY
  # PERFORMAN IRT ANALYSIS
  #model <- mirt(data = loadedData, model = "F1 = 1-6", itemtype = '2PL', verbose = FALSE)
  
  print("Hello World!")
}

# Programmatically alter your API
#* @plumber
function(pr) {
  pr %>%
    # Overwrite the default serializer to return unboxed JSON
    pr_set_serializer(serializer_unboxed_json())
}