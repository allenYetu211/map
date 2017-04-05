function SqlBuilder(divId, filters) {
    console.log('进来了')
    this._divSelector = '#' + divId;

    var options = {
        allow_empty: true,
        sort_filters: true,
        optgroups: {
            core: {
                en: 'Core',
                fr: 'Coeur'
            },
            text: {
                en: '文本型字段',
                fr: '文本型字段'
            },
            number: {
                en: '数字型字段',
                fr: '数字型字段'
            },
            select: {
                en: '选择型字段',
                fr: '选择型字段'
            }
        },

        plugins: {
            // 'bt-tooltip-errors': {
            //     // delay: 100 
            // },
            // 'sortable': null,
            // 'filter-description': {
            //     // mode: 'bootbox'
            // },
            // 'bt-selectpicker': null,
            // 'unique-filter': null,
            // 'bt-checkbox': {
            //     color: 'primary'
            // },
            // 'invert': null,
            // 'not-group': null
        },

        // standard operators in custom optgroups
        operators: [{
            type: 'equal',
            optgroup: 'basic'
        }, {
            type: 'not_equal',
            optgroup: 'basic'
        }, {
            type: 'in',
            optgroup: 'basic'
        }, {
            type: 'not_in',
            optgroup: 'basic'
        }, {
            type: 'less',
            optgroup: 'numbers'
        }, {
            type: 'less_or_equal',
            optgroup: 'numbers'
        }, {
            type: 'greater',
            optgroup: 'numbers'
        }, {
            type: 'greater_or_equal',
            optgroup: 'numbers'
        }, {
            type: 'between',
            optgroup: 'numbers'
        }, {
            type: 'not_between',
            optgroup: 'numbers'
        }, {
            type: 'begins_with',
            optgroup: 'strings'
        }, {
            type: 'not_begins_with',
            optgroup: 'strings'
        }, {
            type: 'contains',
            optgroup: 'strings'
        }, {
            type: 'not_contains',
            optgroup: 'strings'
        }, {
            type: 'ends_with',
            optgroup: 'strings'
        }, {
            type: 'not_ends_with',
            optgroup: 'strings'
        }, {
            type: 'is_empty'
        }, {
            type: 'is_not_empty'
        }, {
            type: 'is_null'
        }, {
            type: 'is_not_null'
        }],
    };
    options.filters = filters;
    $(this._divSelector).queryBuilder(options);
}

SqlBuilder.prototype.getSql = function() {
    var res = $(this._divSelector).queryBuilder('getSQL', $(this).data('stmt'), false);
    return res.sql + (res.params ? '\n\n' + JSON.stringify(res.params, undefined, 2) : '');
};

SqlBuilder.prototype.reset = function() {
    $(this._divSelector).queryBuilder('reset');
};