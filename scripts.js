(function() {
  
  let quotes = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=JSONPCallback";
  
  let quoteContainer = document.querySelector("#quote");
  let author = document.querySelector("span");
  let cite = document.querySelector("p"); 
  let tweetlet = document.querySelector("#tweet");


  var jsonp = {
      callbackCounter: 0,

      fetch: function(url, callback) {
          var fn = 'JSONPCallback_' + this.callbackCounter++;
          window[fn] = this.evalJSONP(callback);
          url = url.replace('=JSONPCallback', '=' + fn);

          var scriptTag = document.createElement('SCRIPT');
          scriptTag.src = url;
          document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
        console.log(callback)
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
                            .replace(/<[^>]*>|\\n/g,"")
                            .replace(/&#8217;/g,"'");  

      cite.innerHTML = citeContent;

      let citeAuthor = JSON.stringify(data[0].title)
                           .replace(/"/g,"");

      author.textContent = citeAuthor;

      quoteContainer.appendChild(cite);
      quoteContainer.appendChild(author);   

      tweet.href = `https://twitter.com/intent/tweet?text=${citeContent} ${citeAuthor}`;

  };

  document.querySelector("#loadData").onclick = () => {

      quoteContainer.removeChild(cite);
      quoteContainer.removeChild(author);    

    jsonp.fetch(quotes, loadStuff);
  };

  jsonp.fetch(quotes, loadStuff);

}());