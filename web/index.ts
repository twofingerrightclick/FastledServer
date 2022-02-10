
class LedRemote {
  brightness: KnockoutObservable<number> = ko.observable();
  speed: KnockoutObservable<number> = ko.observable(50);
  NUM_LEDS: KnockoutObservable<number> = ko.observable(50);
  numLedsInput: KnockoutObservable<string> = ko.observable("50");
  validNumbersOfColorsToUseFromPalette: Array<number>;
  numbersOfColorsToUseFromPaletteIndex: KnockoutObservable<number> = ko.observable(0);
  numbersOfColorsToUseFromPalette: KnockoutObservable<number> = ko.observable(256);
  numberOfLedsPerPaletteColor: KnockoutObservable<number> = ko.observable(5);
  palette: KnockoutObservable<Palette> =
    ko.observable(new Palette((c: any) => this.setGradient(),
      (c: any) => this.setSolidColor()));
  serverAddress: KnockoutObservable<string> = ko.observable("10.42.0.144");

  constructor() {
    this.brightness.subscribe(this.setBrightness);
    this.numLedsInput.subscribe(() => { this.NUM_LEDS(Number.parseInt(this.numLedsInput())); console.log(`numLeds: ${this.NUM_LEDS()}`) });
    this.speed.subscribe(this.setSpeed);

    this.numberOfLedsPerPaletteColor.subscribe(this.setNumberOfLedsPerPaletteColor);

    this.validNumbersOfColorsToUseFromPalette = this.getValidNumberOfColorsPerPalette();
    this.numbersOfColorsToUseFromPaletteIndex(this.validNumbersOfColorsToUseFromPalette.length - 1);
    this.numbersOfColorsToUseFromPalette(this.validNumbersOfColorsToUseFromPalette[this.validNumbersOfColorsToUseFromPalette.length - 1]);
    this.numbersOfColorsToUseFromPaletteIndex.subscribe(this.setGradientStep);
    this.numbersOfColorsToUseFromPaletteIndex.subscribe((value) => this.numbersOfColorsToUseFromPalette(this.validNumbersOfColorsToUseFromPalette[value]));
  }

  setStopAnimations = (_.debounce(async () => {
    await this.post(Pattern.none_, {})
  }, 50));

  setBrightness = (_.debounce(async () => {
    await this.post(Pattern.brightness_, { data: this.brightness() })
  }, 100));

  setGradientStep = (_.debounce(async () => {
    const gradientStep = Math.ceil(
      this.palette().NUM_COLORS_FASTLED_PALETTE /
      this.validNumbersOfColorsToUseFromPalette[this.numbersOfColorsToUseFromPaletteIndex()]);
    console.log(gradientStep);
    await this.post(Pattern.gradientStep_, { data: gradientStep });
  }, 100));

  setSpeed = (_.debounce(async () => {
    await this.post(Pattern.speed_, { data: this.speed() })
  }, 200));

  setNumberOfLedsPerPaletteColor = (_.debounce(async () => {
    await this.post(Pattern.numLedsPerPaletteColor_, { data: this.numberOfLedsPerPaletteColor() })
  }, 200));

  setSolidColor = (async () => {
    await this.post(Pattern.solidColor_, { data: this.palette().solidColor().rgb() })
  });

  setGradient = (async () => {
    const colors = this.palette().getPaletteRgbArray();
    const payload = { data: colors, length: colors.length }
    await this.post(Pattern.gradient_, payload)
  });

  setRainbow = (async () => {
    await this.post(Pattern.rainbow_, {})
  });

  flowPalette = (async () => {
    await this.post(Pattern.flowPalette_, { data: this.speed() })
  });

  getValidNumberOfColorsPerPalette = () => {
    let prev = Number.MAX_SAFE_INTEGER;
    const arr = [];

    for (let i = this.palette().NUM_COLORS_FASTLED_PALETTE; i >= 1; i--) {
      let num = Math.ceil(256 / i);
      if (num != prev) {
        arr.push(num)
        prev = num;
      }
    }
    return arr
  }

  post = async (pattern: Pattern, data: any) => {

    data = { type: pattern, ...data }

    const rawResponse = await fetch(`http://${this.serverAddress()}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

}

enum Pattern {
  none_,
  solidColor_,
  brightness_,
  gradient_,
  rainbow_,
  flowPalette_,
  breathePalette_,
  speed_,
  gradientStep_,
  numLedsPerPaletteColor_

}


class Color {

  hex: KnockoutObservable<string> = ko.observable();
  hsv = (): HSVColor => (
    this.hex2hsv(this.hex())
  );


  constructor(hex: string = "#000000") {
    this.hex(hex);
  }


  rgb = (): Array<number> => {
    return this.hex2Rgb(this.hex());
  }

  hex2Rgb = (hex: string) => {
    const hexSans = hex.substring(1, 7);
    const r = parseInt((hexSans).substring(0, 2), 16);
    const g = parseInt((hexSans).substring(2, 4), 16);
    const b = parseInt((hexSans).substring(4, 6), 16);

    return [r, g, b];
  }


  hex2hsv = (hex: string): HSVColor => {

    const hexSans = hex.substring(1, 7);
    let r = parseInt((hexSans).substring(0, 2), 16);
    let g = parseInt((hexSans).substring(2, 4), 16);
    let b = parseInt((hexSans).substring(4, 6), 16);

    var computedH = 0;
    var computedS = 0;
    var computedV = 0;

    /* remove spaces from input RGB values, convert to int */
    r = parseInt(('' + r).replace(/\s/g, ''), 10);
    g = parseInt(('' + g).replace(/\s/g, ''), 10);
    b = parseInt(('' + b).replace(/\s/g, ''), 10);

    if (r == null || g == null || b == null ||
      isNaN(r) || isNaN(g) || isNaN(b)) {
      alert('Please enter numeric RGB values!');
      return;
    }
    if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
      alert('RGB values must be in the range 0 to 255.');
      return;
    }
    r = r / 255; g = g / 255; b = b / 255;
    var minRGB = Math.min(r, Math.min(g, b));
    var maxRGB = Math.max(r, Math.max(g, b));

    /* Black-gray-white */
    if (minRGB == maxRGB) {
      computedV = minRGB;
      return { h: 0, s: 0, v: computedV };
    }

    /* Colors other than black-gray-white: */
    var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
    var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
    computedH = 60 * (h - d / (maxRGB - minRGB));
    computedS = (maxRGB - minRGB) / maxRGB;
    computedV = maxRGB;
    return { h: computedH, s: computedS, v: computedV };
  }
}

type OnNewValue = (newValue:any) => void;

class PaletteColor extends Color {
  getAnchorPoint = () => parseInt(this.anchorPoint() as any);
  anchorPoint = ko.observable(0);
  index: KnockoutObservable<number> = ko.observable();
  onHexChange: KnockoutObservable<OnNewValue>=ko.observable((newValue:string)=>{});
  constructor(index: number, hex: string, onHexChanges: (newValue: string) => any = undefined) {
    super(hex);
    this.index(index);
    if (onHexChanges) {
      this.onHexChange(onHexChanges);
      this.hex.subscribe(this.onHexChange());
    }
  }



}

class Palette {
  colors: KnockoutObservableArray<KnockoutObservable<PaletteColor>> = ko.observableArray();
  solidColor: KnockoutObservable<PaletteColor> = ko.observable();
  NUM_COLORS_FASTLED_PALETTE: number = 256;
  onPaletteColorChange: (newValue: any) => any;
  onSolidColorChange: (newValue: any) => any;
  constructor(onPaletteColorChange: (newValue: any) => any, onSolidColorColorChange: (newValue: any) => any) {
    this.solidColor = ko.observable(new PaletteColor(0, "#000000", onSolidColorColorChange));
    //always have atleast one color in the palette
    this.colors.push(this.solidColor);
    this.onPaletteColorChange = onPaletteColorChange;
    this.onSolidColorChange = onSolidColorColorChange;
  }
  newColor = () => ko.observable(new PaletteColor(this.colors().length, "#000000", this.onPaletteColorChange))

  addColor = () => { if (this.colors().length < 8) { this.colors.push(this.newColor()); this.adjustAnchorPoints() } }

  removeColor = (color?: PaletteColor) => {
    if (this.colors().length > 1) {
      if (color.index != undefined) {
        this.colors.remove(c => c().index == color.index);
      }
      else {
        this.colors.pop();
      }
      this.adjustAnchorPoints();
    }
  };

  setSolidColor = (color: PaletteColor) => {
    color.onHexChange(this.onSolidColorChange);
    this.solidColor(color);
  }

  adjustIndexes = () => {
    for (let index = 0; index < this.colors().length; index++) {
      this.colors()[index]().index(index);
      //always make the first color the solid color
      if (index == 0) {
        this.setSolidColor(this.colors()[index]());
      }
    }
  };

  adjustAnchorPoints = () => {
    this.adjustIndexes();
    const interval = Math.floor(255 / (this.colors().length - 1));
    this.colors().forEach(color => {
      const adjustedPaletteColor = color();
      const newAnchorPoint =
        adjustedPaletteColor.index() == 0 ? 0 : adjustedPaletteColor.index() == this.colors().length - 1 ?
          255 : adjustedPaletteColor.index() * interval;
      adjustedPaletteColor.anchorPoint(newAnchorPoint);
      color(adjustedPaletteColor);
    })
  }

  getHsvArray = () => {
    {
      num: this.colors().length;
      colors: this.colors().map(color => color().hsv)
    }
  }

  getPaletteRgbArray = () => {
    return (() => {
      let fastLedPalette = new Array<number>();
      this.colors().forEach(color => fastLedPalette.push(color().getAnchorPoint(), ...color().rgb()))
      return fastLedPalette;
    })()

  }

}


type HSVColor = {
  h: number;
  s: number;
  v: number;
}

type HexColor = {
  index: number;
  hex: string;
}

type HSLGradient = {
  colors: HSVColor[];
}

const applyViewModel = () => ko.applyBindings(new LedRemote());

//apply only once knockout and lodash are loaded
const waitToApplyViewModel = () => {

  try {
    if (_ != undefined && ko != undefined) {
      try {
        applyViewModel();
      } catch (error) {
        console.error(error);
      }
    }


  } catch {
    setTimeout(waitToApplyViewModel, 200);
  }
}

waitToApplyViewModel();