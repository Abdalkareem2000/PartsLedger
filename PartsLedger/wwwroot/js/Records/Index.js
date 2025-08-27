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
                        '<button class="btn btn-sm btn-danger delete-record" data-id="' + r.id + '"><i class="fas fa-trash-alt"></i></button>' +
                        '</td>' +
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
