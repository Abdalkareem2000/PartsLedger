var GetRecords = {
    onStart: function () {
        GetRecords.getData();
        toastr.options.positionClass = 'toast-top-center';
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

        let deleteId = null;

        $('body').on('click', '.delete-record', function () {
            deleteId = $(this).data('id');
            const recordName = $(this).data('name');

            // Update modal message with bold record name
            $('#deleteConfirmModal .modal-body').html(
                'Are you sure you want to delete <strong>' + recordName + '</strong>?'
            );

            $('#deleteConfirmModal').modal('show');
        });


        // Handle confirm delete
        $('#confirmDeleteBtn').on('click', function () {
            if (deleteId) {
                $.ajax({
                    url: '/Records/Delete/' + deleteId,
                    type: 'POST',
                    success: function () {
                        $('#deleteConfirmModal').modal('hide'); // Hide modal
                        toastr.success('Record deleted successfully.');
                        GetRecords.getData();
                    },
                    error: function () {
                        $('#deleteConfirmModal').modal('hide');
                        toastr.error('Error deleting record.');
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
            const decreaseQuantity = parseFloat($('#decreaseQuantity').val());
            const currentQuantity = parseInt($('#currentQuantity').val(), 10);

            if (isNaN(decreaseQuantity) || decreaseQuantity <= 0 || !Number.isInteger(decreaseQuantity)) {
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

        $('#decreaseQtyModal').on('hidden.bs.modal', function () {
            $('#decreaseQuantity').val('');
        });

        $('#increaseQtyModal').on('hidden.bs.modal', function () {
            $('#increaseQuantity').val('');
            $('#increaseUnitPrice').val('');
            $('#increaseSource').val('');
            $('#increaseRecordId').val('');
        });


        // Handle confirm button
        $('#confirmIncrease').on('click', function () {
            const id = $('#increaseRecordId').val();
            const quantity = parseFloat($('#increaseQuantity').val());
            const unitPrice = parseFloat($('#increaseUnitPrice').val());
            const source = $('#increaseSource').val();

            if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
                toastr.error('Please enter a valid quantity.');
                return;
            }
            if (!unitPrice || unitPrice <= 0) {
                toastr.error('Please enter a valid Unit Price.');
                return;
            }
            if (!source) {
                toastr.error('Please enter Update By.');
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

        $('body').on('click', '.logs-btn', function () {
            const recordId = $(this).data('id');
            // Redirect to another view, passing the ID
            window.location.href = '/Records/RecordLogs/' + recordId;
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
                        '<button class="btn btn-sm btn-warning decrease-qty" data-id="' + r.id + '" data-quantity="' + r.quantity + '"><i class="fas fa-minus"></i></button>  ' + 
                        '<button class="btn btn-sm btn-success increase-qty" data-id="' + r.id + '"><i class="fas fa-plus"></i></button> ' +
                        '<button class="btn btn-sm btn-info logs-btn" data-id="' + r.id + '"> <i class="fas fa-list"></i></button> ' +
                        '<button class="btn btn-sm btn-danger delete-record" data-id="' + r.id + '" data-name="' + r.product + '">  <i class="fas fa-trash-alt"></i></button> ' +
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
