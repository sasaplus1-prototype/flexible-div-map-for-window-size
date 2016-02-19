(function(){

  'use strict';

  function DivMap() {
    this.lines = [];
  }

  DivMap.prototype.forEach = function(iteratee) {
    var y, ylen, x, xlen;

    for (y = 0, ylen = this.lines.length; y < ylen; ++y) {
      for (x = 0, xlen = this.lines[y].length; x < xlen; ++x) {
        iteratee(this.lines[y][x], y, x);
      }
    }
  };

  DivMap.prototype.pad = function(source) {
    var y, ylen, x, xlen, fn;

    fn = (typeof source === 'function') ? source : function() {
      return source;
    };

    for (y = 0, ylen = this.lines.length; y < ylen; ++y) {
      for (x = 0, xlen = this.lines[y].length; x < xlen; ++x) {
        this.lines[y][x] || (this.lines[y][x] = fn());
      }
    }

    fn = null;
  };

  DivMap.prototype.resize = function(params) {
    var line, column, y, ylen, x, xlen;

    line = params.line;
    column = params.column;

    for (y = 0, ylen = line; y < ylen; ++y) {
      this.lines[y] || (this.lines[y] = []);

      for (x = 0, xlen = column; x < xlen; ++x) {
        this.lines[y][x] || (this.lines[y][x] = null);
      }
    }
  };

  //----------------------------------------------------------------------------

  var boxSize = {
    width: 50,
    height: 50
  };

  var dm = new DivMap();

  var frame = $('#js-frame');

  var count = 0;

  function remap() {
    var line, column, fragment;

    line = Math.floor(frame.height() / boxSize.height);
    column = Math.floor(frame.width() / boxSize.width);

    fragment = $(document.createDocumentFragment());

    dm.resize({
      line: line,
      column: column
    });
    dm.pad(function() {
      return $('<div class="box" style="background-color: ' + [
        '#ff7f7f',
        '#7fbfff',
        '#7fffff',
        '#7fffbf',
        '#ffff7f',
        '#ffbf7f'
      ][count % 6] + ';" data-count="' + count + '" />');
    });
    dm.forEach(function(dot, y, x) {
      if (x > column) {
        return dot.detach();
      }

      dot.css({
        width: boxSize.width,
        height: boxSize.height,
        top: y * boxSize.height,
        left: x * boxSize.width
      });

      fragment.append(dot);
    });

    frame.append(fragment);

    ++count;
  }

  //----------------------------------------------------------------------------

  $(window).on('resize.remap', _.debounce(remap, 100));

  $(remap);

}());
