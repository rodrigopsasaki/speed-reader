var readerApp = angular.module("readerApp", []);

function ReaderCtrl($scope, $timeout){

    $scope.player = {
        playing: false,
        slider: {
            getSlider: function(){
                return angular.element('#slider');
            },
            updateSlider: function(){
                $scope.player.slider.getSlider().val($scope.textController.getProgressPercentage());
            },
            updateDisplay: function(){
                $scope.textController.counter = $scope.player.getCounterPositionByPercentage($scope.player.slider.getSlider().val());
                $scope.textController.showNextChunk();
                $scope.$apply();
            }
        },
        getCounterPositionByPercentage: function(percentage){
            if(percentage == 100){
                return $scope.textController.splitText.length - 1;
            }
            return parseInt((percentage * $scope.textController.splitText.length) / 100);
        },
        play: function(){
            $scope.player.playing = true;
            $scope.player.playLoop();
        },
        playLoop: function(){
            if($scope.textController.hasMoreWords() && $scope.player.playing == true) {
                $scope.textController.showNextChunk();
                $scope.player.slider.updateSlider();
                $timeout($scope.player.playLoop, (1000 / ($scope.config.wordsPerMinute / 60)) * $scope.config.wordsPerChunk);
            } else {
                $scope.player.playing = false;
            }
        },
        pause: function(){
            $scope.player.playing = false;
        },
        restart: function(){
            $scope.player.textAlreadyReadAlert = false;
            $scope.textController.init();
            $scope.player.slider.updateSlider();
        }
    };

    $scope.textController = {
        defaultText: "Speed reading is the art of silencing subvocalization. Most readers have an average reading speed of 200 wpm, which is about as fast as they can read a passage out loud. This is no coincidence. It is their inner voice that paces through the text that keeps them from achieving higher reading speeds. They can only read as fast as they can speak because that's the way they were taught to read, through reading systems like Hooked on Phonics.\n\n"
            + "However, it is entirely possible to read at a much greater speed, with much better reading comprehension, by silencing this inner voice. The solution is simple - absorb the reading material faster than that inner voice can keep up.\n\n"
            + "In the real world, speed reading is achieved through methods like reading passages using a finger to point your way. You read through a page of text by following your finger line by line at a speed faster than you can normally read. This works because the eye is very good at tracking movement. Even if at this point full reading comprehension is lost, it's exactly this method of training that will allow you to read faster.\n\n"
            + "With the aid of software like Spreeder, it's much easier to achieve this same result with much less effort. Load a passage of text (like this one), and the software will pace through the text at a predefined speed that you can adjust as your reading comprehension increases.\n\n"
            + "To train to read faster, you must first find your base rate. Your base rate is the speed that you can read a passage of text with full comprehension. We've defaulted to 300 wpm, showing one word at a time, which is about the average that works best for our users. Now, read that passage using spreeder at that base rate.\n\n"
            + "After you've finished, double that speed by going to the Settings and changing the Words Per Minute value. Reread the passage. You shouldn't expect to understand everything - in fact, more likely than not you'll only catch a couple words here and there. If you have high comprehension, that probably means that you need to set your base rate higher and rerun this test again. You should be straining to keep up with the speed of the words flashing by. This speed should be faster than your inner voice can “read”.\n\n"
            + "Now, reread the passage again at your base rate. It should feel a lot slower – if not, try running the speed test again. Now try moving up a little past your base rate – for example, at 400 wpm – and see how much you can comprehend at that speed.\n\n"
            + "That's basically it - constantly read passages at a rate faster than you can keep up, and keep pushing the edge of what you're capable of. You'll find that when you drop down to lower speeds, you'll be able to pick up much more than you would have thought possible.\n\n"
            + "One other setting that's worth mentioning in this introduction is the chunk size – the which is the number of words that are flashed at each interval on the screen. When you read aloud, you can only say one word at a time. However, this limit does not apply to speed reading. Once your inner voice subsides and with constant practice, you can read multiple words at a time. This is the best way to achieve reading speeds of 1000+ wpm. Start small with 2 word chunk sizes and find out that as you increase, 3,4, or even higher chunk sizes are possible.\n\n"
            + "Good luck!",
        rawText: '',
        splitText: [],
        chunk: '',
        counter: 0,
        wordsPerChunk: 1,
        wordsPerMinute: 300,
        showNextChunk: function(){
            $scope.textController.chunk = $scope.textController.getNextChunk();
        },
        getNextChunk: function(){
            var tempChunk = '';
            var currentCounter = $scope.textController.counter;
            for(var i = currentCounter ; i < (currentCounter + $scope.textController.wordsPerChunk) && $scope.textController.hasMoreWords(); i++){
                var word = $scope.textController.getNextWord();
                tempChunk = tempChunk + ' ' + word;
            }
            return tempChunk;
        },
        getNextWord: function(){
            var word = $scope.textController.splitText[$scope.textController.counter];
            $scope.textController.counter = $scope.textController.counter + 1;
            return word;
        },
        init: function(){
            $scope.textController.counter = 0;
            $scope.textController.breakRawText();
            $scope.textController.showNextChunk();
        },
        breakRawText: function(){
            $scope.textController.splitText = $scope.textController.rawText.split(/\s+/);
        },
        hasMoreWords: function(){
            return $scope.textController.counter < $scope.textController.splitText.length;
        },
        getProgressPercentage: function(){
            return parseInt($scope.textController.counter * 100 / $scope.textController.splitText.length);
        },
        resetTextToDefault: function(){
            $scope.textController.rawText = $scope.textController.defaultText;
        }
    }

    $scope.navigation = {
        showHomeScreen: true,
        showReaderScreen: false,
        launchReaderScreen: function(){
            $scope.navigation.showHomeScreen = false;
            $scope.navigation.showReaderScreen = true;
            $scope.textController.init();
        },
        launchHomeScreen: function(){
            $scope.navigation.showHomeScreen = true;
            $scope.navigation.showReaderScreen = false;
            $scope.player.pause();
        }
    }

    $scope.config = {
        wordsPerChunkValues: [1, 2, 3, 4, 5, 6],
        wordsPerChunk: 1,
        wordsPerMinute: 200,
        valid: true,
        validWordsPerChunk: true,
        validWordsPerMinute: true,
        initConfigModal: function(){
            $scope.config.validWordsPerChunk = true;
            $scope.config.validWordsPerMinute = true;
            $scope.config.wordsPerChunk = $scope.textController.wordsPerChunk;
            $scope.config.wordsPerMinute = $scope.textController.wordsPerMinute;
            $scope.player.pause();
        },
        closeConfigModal: function(){
            angular.element('#configModal').foundation('reveal', 'close');
        },
        saveConfiguration: function(){
            if($scope.config.validation.validWordsPerChunk() & $scope.config.validation.validWordsPerMinute()){
                $scope.textController.wordsPerChunk = $scope.config.wordsPerChunk;
                $scope.textController.wordsPerMinute = $scope.config.wordsPerMinute;
                $scope.textController.init();
                $scope.player.slider.updateSlider();
                $scope.config.closeConfigModal();
            }
        },
        validation: {
            validWordsPerChunk: function(){
                var e = angular.element('#wordsPerChunk');
                var value = e.val();
                var valid = isInteger(value) && value >= 1 && value <= 6;

                $scope.config.validWordsPerChunk = valid;
                return valid;
            },
            validWordsPerMinute: function(){
                var e = angular.element('#wordsPerMinute');
                var value = e.val();
                var valid = isInteger(value) && value >= 200 && value <= 1000;

                $scope.config.validWordsPerMinute = valid;
                return valid;
            }
        }
    };

    //Necessary code to start and configure the slider
    angular.element("#slider").noUiSlider({
        start: 0,
        step: 1,
        connect: 'lower',
        range: {
            'min': 0,
            'max': 100
        }
    });

    // Callback method
    angular.element("#slider").on({
        slide: function(){
            $scope.player.slider.updateDisplay();
        },
        change: function(){
            $scope.player.slider.updateDisplay();
        }
    })

    //initializing main text
    function init(){
        $scope.textController.resetTextToDefault();
    }
    init();

}

function isInteger(n) {
    return !isNaN(parseInt(n)) && isFinite(n) && n == parseInt(n);
}

