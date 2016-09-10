
var CONFIG = {
    localStorageDataKey: 'hwData'
};


var QRGen = (function() {
    function generate(param) {
        new QRCode(document.getElementById("qrcode"), param.url);
    }
    
    return {
        generate: generate
    };
})();

var QRScan = (function (C) {
    
    function scan() {
        console.log('scan runned')
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if(!result.cancelled)
                {
                    if(result.format == "QR_CODE")
                    {
                        navigator.notification.prompt("Please enter name of data",  function(input){
                            var name = input.input1;
                            var value = result.text;

                            var data = localStorage.getItem(C.localStorageDataKey);
                            console.log(data);
                            data = JSON.parse(data);
                            data[data.length] = {
                                name: name,
                                url: value
                            };

                            localStorage.setItem(C.localStorageDataKey, JSON.stringify(data));

                            alert("Done");
                        });
                    }
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
       );
    }
    console.log('scan inited')
    return {
        scan: scan
    }
})(CONFIG);

var Helper = (function (c) {
    function mockData() {
      var data = [{
          name: 'Super Deal',
          url: 'https://hotwire.com'
      }, {
          name: 'Random Deal',
          url: 'https://hotwire.com'
      }, {
          name: 'Best deal',
          url: 'https://hotwire.com'
      }]  
      
      localStorage.setItem(c.localStorageDataKey, JSON.stringify(data));
    };
    
    return {
        mockData: mockData
    };
})(CONFIG);

// init config
(function () {
    phonon.options({

        navigator: {
            defaultPage: 'home',
            hashPrefix: '!', // default #!pagename
            animatePages: true,
            enableBrowserBackButton: true,
            templateRootDirectory: '',
            //defaultTemplateExtension: 'html', // if you use page templates
            useHash: true
        },
        // i18n: null if you do not want to use internationalization
        i18n: null
    });
    
    if(localStorage.getItem("LocalData") == null) {
        var data = [];
        data = JSON.stringify(data);
        localStorage.setItem(CONFIG.localStorageDataKey, data);
    }
    
    function debug() {
        console.info('It works!')
    }
    
    // moks for test;
    Helper.mockData();
    
    document.querySelector('#getScan').on('tap', QRScan.scan);
    document.querySelector('#genCode').on('tap', QRGen.generate.bind(QRGen, {
        url: "https://hotwire.com"
    }));
})();