library(mirt)
library(plumber)
library(jsonlite)
library(later)

#* @apiTitle MIRT IRT API
#* @apiDescription API for performance IRT with 'mirt' packgage

#* @post /estimate_difficulty
function(req) {
  # LOAD DATA FROM REQUEST BODY
  data <- req$body
  print(data)
  dataFrame <- data.frame(A = data$A,
                          B = data$B,
                          C = data$C,
                          D = data$D,
                          E = data$E,
                          F = data$F)
  print(dataFrame)
  print(dim(dataFrame))
  
  # PERFORMAN IRT ANALYSIS
  
  mymodel <- mirt(data = dataFrame,
                  model = "F1 = 1-6",
                  itemtype = '2PL',
                  verbose = FALSE)
}

# Programmatically alter your API
#* @plumber
function(pr) {
  pr %>%
    # Overwrite the default serializer to return unboxed JSON
    pr_set_serializer(serializer_unboxed_json())
}