var RecordLogs = {
    onStart: function () {
        RecordLogs.getData();
        toastr.options.positionClass = 'toast-top-center';
        // زر البحث
        $('#applyFilters').on('click', function () {
            $('#pageNumber').val(1);
            RecordLogs.getData();
        });

        // زر إعادة التصفية
        $('#resetFilters').on('click', function () {
            $('#filterFromDate').val(null);
            $('#filterToDate').val(null);
            $('#pageNumber').val(1);
            RecordLogs.getData();
        });

        // زر التالي
        $('#nextPage').on('click', function () {
            var currentPage = parseInt($('#pageNumber').val(), 10) || 1;
            $('#pageNumber').val(currentPage + 1);
            RecordLogs.getData();
        });

        // زر السابق
        $('#previousPage').on('click', function () {
            var currentPage = parseInt($('#pageNumber').val(), 10) || 1;
            $('#pageNumber').val(currentPage - 1);
            RecordLogs.getData();
        });
    },

    getData: function () {
        var fromDate = $('#filterFromDate').val(); // optional
        var toDate = $('#filterToDate').val();     // optional
        var recoredId = $('#recordId').val();
        var pageNumber = $('#pageNumber').val();

        $.ajax({
            url: '/Records/GetRecordLogs',
            type: 'GET',
            data: {
                fromDate: fromDate,
                toDate: toDate,
                recoredId: recoredId,
                pageNumber: pageNumber
            },
            success: function (data) {
                var tbody = $('#recordLogsTableBody');
                tbody.empty();

                $.each(data.records, function (index, r) {
                    var row =
                    '<tr>' +
                        '<td>' + ((data.pageSize * (data.pageIndex - 1)) + (index + 1)) + '</td>' +
                        '<td>' + r.timestamp.split('T')[0] + '</td>' +
                        '<td>' + (r.action == 0 ? 'Sold' : 'Buy') + '</td>' +
                        '<td>' + r.quantity + '</td>' +
                        '<td>' + r.unitPrice + '</td>' +
                        '<td>' + r.quantityBefore + '</td>' +
                        '<td>' + r.quantityAfter + '</td>' +
                        '<td>' + r.source + '</td>' +
                    '</tr>';
                    tbody.append(row);
                });

                RecordLogs.toggleButton('#nextPage', data.hasNextPage);
                RecordLogs.toggleButton('#previousPage', data.hasPreviousPage);
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
