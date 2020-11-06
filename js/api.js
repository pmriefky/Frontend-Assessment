const url  = 'http://dummy.restapiexample.com/api/v1/employees';
indexArray = 0;
let nameDropdown = $('#name');
let distributionDropdown = $('#distribution');
let detailAdded = $('#detail_added');
let productPanel = $('#product_panel');
let dividerProduct = $('#divider_product');

var id = null;
var paymentTypeData = [
    {'id' : 1,'name' : 'Cash H+1'},
    {'id' : 2,'name' : 'Cash H+3'},
    {'id' : 3,'name' : 'Cash H+7'},
    {'id' : 4,'name' : 'Transfer H+1'},
    {'id' : 5,'name' : 'Transfer H+3'},
    {'id' : 6,'name' : 'Transfer H+7'}
];

var productData =[
    {product_name: 'product_1', units: [{name:'pack', price : 10000}, {name: 'pcs', price:1000}]},
    {product_name: 'product_2', units: [{name:'pack', price : 10000}, {name: 'pcs', price:1000}]},
    {product_name: 'product_3', units: [{name:'karton', price : 10000}, {name: 'pcs', price:1000}]},
];
let productDropdown = $('#product');
let unitDropdown = $('#unit');
let paymentDropdown = $('#payment');

$(document).ready(function(){
    nameDropdown.empty();
    distributionDropdown.empty();
    detailAdded.hide();
    //productPanel.hide();
    //dividerProduct.hide();
    $.each(productData, function(key, entry){
        $('.form-group .product').append($('<option></option>')
        .attr('value', entry.product_name)
        .text(entry.product_name))
    })

    distributionDropdown.append('<option selected="true" disabled>No Data Available</option>');
    nameDropdown.append('<option selected="true" disabled>Pilih Nama</option>');
    nameDropdown.prop('selectedIndex', 0);

    $.getJSON(url, function(data){
        $.each(data.data, function(key, entry){
            if(data!= null){
                nameDropdown.append($('<option></option>')
                .attr('value', entry.id)
                .text(entry.employee_name));
            }
        })
    })
})

$('#name').change(function(){
    id = $('#name option:selected').val();
    if(id != null){
        distributionDropdown.empty()
        distributionDropdown.append($('<option></option>')
            .attr('value', 1)
            .text('DC Tanggerang'))
        distributionDropdown.append($('<option></option>')
            .attr('value', 2)
            .text('DC Cikarang'))
        
        $.each(paymentTypeData, function(key, entry){
            paymentDropdown.append($('<option></option>')
            .attr('value', entry.id)
            .text(entry.name))
        })
    }
})

$('#distribution').click(function(){
    var count = 0;
    $.each($("#distribution option:selected"), function(){
        if ( $(this).val() == 1 || $(this).val() == 2) {
        ++count;
        }
    });
    if(count > 0)
        detailAdded.show()
})

$('#expired').change(function(){
    var dateExpired = $("#expired").val();
    if(dateExpired!=null){
        productDropdown.empty();
        unitDropdown.empty();

        productDropdown.append('<option selected="true" disabled>Product Name</option>')
        unitDropdown.append('<option selected="true" disabled>No Data Available</option>')

        $.each(productData, function(key, entry){
            productDropdown.append($('<option></option>')
            .attr('value', entry.product_name)
            .text(entry.product_name))
        })
        productPanel.show()
    }else{
        productPanel.hide()
    }
})

$('.form-group .product').on('change',function(){
    var index = $(this).attr('data-index'); 
    var productSelected = $('#product_'+index).val()
    $('.form-group #unit_'+index).empty()
    $.each(searchUnitFromProduct(productSelected).units, function(key, entry){
        $('.form-group #unit_'+index).append($('<option></option>')
            .attr('value', entry.name)
            .text(jsUcfirst(entry.name)))
    })
    $('#price').val(searchUnitFromProduct(productSelected).units[0].price)
    $('#quantity').val('0')
    $('#total_price').val(0)
})

$(document).on('change','.form-group .product', function(){
    var index = $(this).attr('data-index'); 
    var productSelected = $('#product_'+index).val()
    $('.form-group #unit_'+index).empty()
    $.each(searchUnitFromProduct(productSelected).units, function(key, entry){
        $('.form-group #unit_'+index).append($('<option></option>')
            .attr('value', entry.name)
            .text(jsUcfirst(entry.name)))
    })
    $('#price_'+index).val(searchUnitFromProduct(productSelected).units[0].price)
    $('#quantity_'+index).val('0')
    $('#total_price_'+index).val(0)
    updateTextTotal();
})

$(document).on('change','.form-group .unit', function(){
    var index = $(this).attr('data-index'); 
    var productName = $('#product_'+index).val();
    var unitName = $('#unit_'+index).val();
    $('#price_'+index).val(searchPriceFromProduct(productName, unitName).price)
    $('#quantity_'+index).val('0')
    $('#total_price_'+index).val(0)
    validateConfirm();
})

$(document).on('change paste keyupe','.form-group .quantity', function(){
    var index = $(this).attr('data-index');
    if($('#quantity_'+index).val() != null && $('#quantity_'+index).val() >= 0){
        var quantity = $('#quantity_'+index).val();
        var price = $('#price_'+index).val();
        var total = quantity * price;
        $('#total_price_'+index).val(total)
        $('#txt_net_total_'+index).text(total);
        updateTextTotal();
    }else{
        $('#total_price').val(0)
        $('#txt_net_total_'+index).text(0);
    }
    validateConfirm();
})

$('#addProduct').click(function(){
    indexArray++;
    var data = 
    '<hr>'+ 
    '<div class="row">'+
        '<div class="col-md-9 form-group">'+
            '<label for="product_">Product*</label>'+
            '<select name="product" id="product_'+indexArray+'" class="browser-default custom-select product" data-index="'+indexArray+'">'+
            '</select>'+
        '</div>'+
        '<div class="col-md-3 form-group">'+
            '<label for="unit">Unit*</label>'+
            '<select name="unit" id="unit_'+indexArray+'" class="browser-default custom-select unit" data-index="'+indexArray+'">'+
            '</select>'+
        '</div>'+
    '</div>'+
    '<div class="row">'+
        '<div class="col-md-3 form-group">'+
            '<label for="quantity">Quantity*</label>'+
            '<input type="number" name="quantity" id="quantity_'+indexArray+'" class="form-control quantity" data-index="'+indexArray+'">'+
        '</div>'+
        '<div class="col-md-3 form-group">'+
            '<label for="price">Price*</label>'+
            '<input type="number" name="price" id="price_'+indexArray+'" class="form-control total_price" data-index="'+indexArray+'">'+
        '</div>'+
        '<div class="col-md-6 form-group">'+
            '<label for="total_price">Total Price*</label>'+
            '<input type="number" name="total_price" id="total_price_'+indexArray+'" class="form-control total_price" readonly data-index="'+indexArray+'">'+
        '<hr>'+
        '</div>'+   
    '</div>'+
    '<div class="row">'+
        '<div class="col-md-6 offset-md-6 ">'+
            '<div class="row">'+
                '<small>Total net price</small>'+
                '<div class="col-md-2"></div>'+
                '<small id="txt_net_total_'+indexArray+'">0</small>'+ 
            '</div>'+
            '</div>'+
        '</div>';

    $('#input_product').append(data);
    $.each(productData, function(key, entry){
        $('#product_'+indexArray).append($('<option></option>')
        .attr('value', entry.product_name)
        .text(entry.product_name))
    })
    validateConfirm();
});

function updateTextTotal(){
    var sumTotal = 0;
    for(var i = 0; i <= indexArray; i++){
        var tmp = $('#total_price_'+i).val();
        sumTotal+=parseInt(tmp);
    }
    console.log(sumTotal);
    $('#total').text(parseInt(sumTotal));
}

function searchUnitFromProduct(productName){
    for (var i=0; i < productData.length; i++) {
        if (productData[i].product_name === productName) {
              return productData[i];
         }
    }
}

function searchPriceFromProduct(productName, unit){
    for (var i=0; i < productData.length; i++) {
        if (productData[i].product_name === productName) {
            for(var j=0; j < productData[i].units.length; j++){
                if(productData[i].units[j].name === unit){
                    return productData[i].units[j]
                }
            }
         }
    }
}

function validateConfirm(){
    var validated = true;
    for(var i = 0; i <= indexArray; i++){
        var tmp = $('#total_price_'+i).val();
        if(tmp == 0){
            validated = false;
            break;
        }
    }
    if(validated){
        $('#btnSuccess'). prop('disabled', false);
    }else{
        $('#btnSuccess'). prop('disabled', true);
    }
}
$('#btnCancel').click(function(){
    validateConfirm();
})

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}