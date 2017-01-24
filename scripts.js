(function() {
  
  let quotes = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=JSONPCallback";
  
  let quoteContainer = document.querySelector("#quote"),
      author = document.querySelector("span"),
      cite = document.querySelector("p"),
      // tweet = document.querySelector("#tweet"),
      head = document.head,
      frag = document.createDocumentFragment();


  var jsonp = {
      callbackCounter: 0,

      fetch: function(url, callback) {
          
          var fn = 'JSONPCallback_' + this.callbackCounter++;
          window[fn] = this.evalJSONP(callback);
          url = url.replace('=JSONPCallback', '=' + fn);

          var scriptTag = document.createElement('SCRIPT');
          scriptTag.src = url;
          document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
          head.removeChild(scriptTag);
      },

      evalJSONP: function(callback) {
          return function(data) {
              var validJSON = false;
          if (typeof data == "string") {
              try {validJSON = JSON.parse(data);} catch (e) {
                  /*invalid JSON*/}
          } else {
              validJSON = JSON.parse(JSON.stringify(data));
                  window.console && console.warn(
                  'response data was not a JSON string');
              }
              if (validJSON) {
                  callback(validJSON);
              } else {
                  throw("JSONP call returned invalid or empty JSON");
              }
          }
      }
  };
  

  let loadStuff = (data) => {

      let citeContent = JSON.stringify(data[0].content)
                            .replace(/<[^>]*>|\\n|;/g,"")
                            .replace(/&#8217|&#8221|&#8220/g,"'");
      cite.textContent = citeContent;
      frag.appendChild(cite);
    
      let citeAuthor = JSON.stringify(data[0].title)
                           .replace(/"/g,"");
      author.textContent = citeAuthor;
      frag.appendChild(author);
    
      quoteContainer.appendChild(frag);
    
      loadTwitter(citeContent, citeAuthor);
    
  };
  
  let loadTwitter = (citeContent, citeAuthor) => {
    tweet.href = `https://twitter.com/intent/tweet?text=${citeContent} ${citeAuthor}`;
  };

  document.querySelector("#loadData").onclick = () => {
      
      quoteContainer.removeChild(cite);
      quoteContainer.removeChild(author);

        jsonp.fetch(quotes, loadStuff);
  };

  jsonp.fetch(quotes, loadStuff);

}());