export class Util {
  static formattedValue(value) {
    // returns the value with brazilian money format
    return Util.number_format(value, 2, ',', '.');
  }

  static formattedTaxValue(value) {
    return value.toString().replace('.', ',');
  }

  static formatDate(date) {
    var monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    var day = date.getDate();
    if(day <= 9) {
        day = '0' + day;
    }
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + '/' + monthNames[monthIndex] + '/' + year;
  }

  static getDateNow() {
    var date = new Date();

    let day: any = date.getDate();
    if(day <= 9) {
      day = '0' + day;
    }

    let month: any = date.getMonth()+1;
    if(month <= 9) {
      month = '0' + month;
    }

    var year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }

  static getTimeNow() {
    var date = new Date();

    let hour: any = date.getHours();
    if(hour <= 9) {
      hour = '0' + hour;
    }

    let minute: any = date.getMinutes();
    if(minute <= 9) {
      minute = '0' + minute;
    }

    return hour + ':' + minute;
  }

  static formatFilterDate(date) {
    var day = date.getDate();
    if(day <= 9) {
        day = '0' + day;
    }

    var month = date.getMonth() + 1;
    if(month <= 9) {
        month = '0' + month;
    }

    var year = date.getFullYear();

    return year+'-'+month+'-'+day
  }

  static getMonday(d: any) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate() - day + (day == 0 ? -6:1); //adj. when day is sunday
    return new Date(d.setDate(diff));
  }

  static getSunday(d: any) {
    d = new Date(d);
    var day = d.getDay();
    var diff = d.getDate();
    if(day != 0) {
      diff = (d.getDate() - day) + 7
    }

    return new Date(d.setDate(diff));
  }

  static getRetiraAcentos = function(nome){
    var map = {
      "â":"a", "Â":"A", "à":"a", "À":"A", "á":"a", "Á":"A", "ã":"a", "Ã":"A",
      "ê":"e", "Ê":"E", "è":"e", "È":"E", "é":"e", "É":"E", "î":"i","Î":"I",
      "ì":"i", "Ì":"I", "í":"i", "Í":"I", "õ":"o", "Õ":"O", "ô":"o", "Ô":"O",
      "ò":"o", "Ò":"O", "ó":"o", "Ó":"O", "ü":"u", "Ü":"U", "û":"u", "Û":"U",
      "ú":"u", "Ú":"U", "ù":"u", "Ù":"U", "ç":"c", "Ç":"C"
    };

    return nome.replace(/[\W\[\] ]/g,function(a){return map[a]||a});
  }

  static number_format(number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep;
    var dec = (typeof dec_point === 'undefined') ? '.' : dec_point;

    let s: any = '';

    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? Util.toFixedFix(n, prec) : '' + Math.round(n)).split('.');

    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
  }

  static toFixedFix = function (n, prec) {
    var k = Math.pow(10, prec);
    return '' + Math.round(n * k) / k;
  };
}