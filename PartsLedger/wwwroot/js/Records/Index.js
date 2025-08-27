var GetRecords = {
    onStart: function () {
        GetRecords.getData();

        // زر البحث
        $('#applyFilters').on('click', function () {
            $('#pageNumber').val(1);
            GetRecords.getData();
        });

        // زر إعادة التصفية
        $('#resetFilters').on('click', function () {
            $('#filterFCNo').val(null);
            $('#filterProduct').val(null);
            $('#pageNumber').val(1);
            GetRecords.getData();
        });

        // زر التالي
        $('#nextPage').on('click', function () {
            var currentPage = parseInt($('#pageNumber').val(), 10) || 1;
            $('#pageNumber').val(currentPage + 1);
            GetRecords.getData();
        });

        // زر السابق
        $('#previousPage').on('click', function () {
            var currentPage = parseInt($('#pageNumber').val(), 10) || 1;
            $('#pageNumber').val(currentPage - 1);
            GetRecords.getData();
        });

        // زر الحذف
        $('body').on('click', '.delete-record', function () {
            const id = $(this).data('id');

            if (confirm('Are you sure you want to delete this record?')) {
                $.ajax({
                    url: '/Records/Delete/' + id,
                    type: 'POST',
                    success: function () {
                        alert('Record deleted successfully.');
                        GetRecords.getData();
                    },
                    error: function () {
                        alert('Error deleting record.');
                    }
                });
            }
        });

        // Open modal when decrease button is clicked
        $('body').on('click', '.decrease-qty', function () {
            const id = $(this).data('id');
            const currentQuantity = $(this).data('quantity');

            $('#recordId').val(id);
            $('#currentQuantity').val(currentQuantity); // hidden field to store quantity
            $('#decreaseAmount').val('');
            $('#decreaseQtyModal').modal('show');
        });


        // When user clicks OK
        $('#confirmDecrease').on('click', function () {
            const id = $('#recordId').val();
            const decreaseQuantity = parseInt($('#decreaseQuantity').val(), 10);
            const currentQuantity = parseInt($('#currentQuantity').val(), 10);

            if (!decreaseQuantity || decreaseQuantity <= 0) {
                toastr.error('Please enter a valid quantity.');
                return;
            }

            if (decreaseQuantity > currentQuantity) {
                toastr.error('Decrease amount cannot be greater than current quantity (' + currentQuantity + ').');
                return;
            }

            $.ajax({
                url: '/Records/DecreaseQuantity',
                type: 'POST',
                data: { id: id, quantity: decreaseQuantity },
                success: function () {
                    $('#decreaseQtyModal').modal('hide');
                    toastr.success('Quantity decreased successfully.');
                    GetRecords.getData();
                },
                error: function () {
                    toastr.error('Error decreasing quantity.');
                }
            });
        });


        // Open modal for increase
        $('body').on('click', '.increase-qty', function () {
            const id = $(this).data('id');
            $('#increaseRecordId').val(id);
            $('#increaseQuantity').val('');
            $('#increaseUnitPrice').val('');
            $('#increaseSource').val('');
            $('#increaseQtyModal').modal('show');
        });

        // Handle confirm button
        $('#confirmIncrease').on('click', function () {
            const id = $('#increaseRecordId').val();
            const quantity = parseInt($('#increaseQuantity').val(), 10);
            const unitPrice = parseFloat($('#increaseUnitPrice').val());
            const source = $('#increaseSource').val();

            if (!quantity || quantity <= 0) {
                toastr.error('Please enter a valid quantity.');
                return;
            }
            if (!unitPrice || unitPrice <= 0) {
                toastr.error('Please enter a valid unitPrice.');
                return;
            }
            if (!source) {
                toastr.error('Please enter the source.');
                return;
            }

            $.ajax({
                url: '/Records/IncreaseQuantity',
                type: 'POST',
                data: {
                    id: id,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    source: source
                },
                success: function () {
                    $('#increaseQtyModal').modal('hide');
                    toastr.success('Quantity increased successfully.');
                    GetRecords.getData();
                },
                error: function () {
                    toastr.error('Error increasing quantity.');
                }
            });
        });

    },

    getData: function () {
        var fcno = $('#filterFCNo').val();
        var product = $('#filterProduct').val();
        var pageNumber = $('#pageNumber').val();

        $.ajax({
            url: '/Records/GetRecords',
            type: 'GET',
            data: {
                fcno: fcno,
                product: product,
                pageNumber: pageNumber
            },
            success: function (data) {
                var tbody = $('#recordsTableBody');
                tbody.empty();

                $.each(data.records, function (index, r) {
                    var row = '<tr>' +
                        '<td>' + ((data.pageSize * (data.pageIndex - 1)) + (index + 1)) + '</td>' +
                        '<td>' + r.fcNo + '</td>' +
                        '<td>' + r.oem + '</td>' +
                        '<td>' + r.product + '</td>' +
                        '<td>' + r.model + '</td>' +
                        '<td>' + r.engineCode + '</td>' +
                        '<td>' + r.fobPrice.toFixed(2) + '</td>' +
                        '<td>' + r.quantity + '</td>' +
                        '<td>' + r.totalUSD.toFixed(2) + '</td>' +
                        '<td>' +
                        '<a href="/Records/Edit/' + r.id + '" class="btn btn-sm btn-primary me-2"><i class="fas fa-edit"></i></a>' +
                        '<button class="btn btn-sm btn-danger delete-record me-2" data-id="' + r.id + '"><i class="fas fa-trash-alt"></i></button>' +
                        '<button class="btn btn-sm btn-warning decrease-qty" data-id="' + r.id + '" data-quantity="' + r.quantity + '"><i class="fas fa-minus"></i></button>  ' + 
                        '<button class="btn btn-sm btn-success increase-qty" data-id="' + r.id + '"><i class="fas fa-plus"></i></button>' +
                        '</td>'
                        '</tr>';
                    tbody.append(row);
                });

                GetRecords.toggleButton('#nextPage', data.hasNextPage);
                GetRecords.toggleButton('#previousPage', data.hasPreviousPage);
                $('#pageNumber').val(data.pageIndex);
                $('#totalPage').text('Pages: ' + data.totalPages);
                $('#divPageNumber').text('Page No: ' + data.pageIndex);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching records:', error);
            }
        });
    },

    toggleButton: function (selector, enabled) {
        $(selector).toggleClass('disabled', !enabled)
            .css({
                'pointer-events': enabled ? 'auto' : 'none',
                'opacity': enabled ? '1' : '0.6'
            });
    }
};
