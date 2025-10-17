// Shopping List Component - Displays aggregated ingredients across all recipes

const ShoppingList = ({ recipes, orderCounts }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [aggregated, setAggregated] = React.useState(null);
    const [sections, setSections] = React.useState([]);

    // Recalculate when orderCounts change
    React.useEffect(() => {
        if (isOpen && recipes && orderCounts) {
            const agg = window.aggregateIngredients(recipes, orderCounts);
            const formatted = window.formatShoppingList(agg);
            setAggregated(agg);
            setSections(formatted);
        }
    }, [isOpen, recipes, orderCounts]);

    // Calculate total recipe count
    const totalOrders = React.useMemo(() => {
        return Object.values(orderCounts || {}).reduce((sum, count) => sum + count, 0);
    }, [orderCounts]);

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const text = sections.map(section => {
            const items = section.items.map(item => `  • ${item.display}`).join('\n');
            return `${section.title}:\n${items}`;
        }).join('\n\n');

        navigator.clipboard.writeText(text);
        alert('Shopping list copied to clipboard!');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 print:hidden"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Shopping List ({totalOrders} recipes)
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:relative print:bg-white print:p-0">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col print:max-h-none print:shadow-none">
                {/* Header */}
                <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between print:bg-white print:text-black print:border-b-2 print:border-green-600">
                    <h2 className="text-2xl font-bold">Shopping List</h2>
                    <div className="flex items-center gap-2 print:hidden">
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md text-sm"
                            title="Copy to clipboard"
                        >
                            Copy
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-green-700 hover:bg-green-800 rounded-md text-sm"
                            title="Print"
                        >
                            Print
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-green-700 rounded-md"
                            title="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="px-6 py-4 bg-gray-50 border-b print:bg-white">
                    <p className="text-sm text-gray-600">
                        Ingredients for <span className="font-bold text-green-700">{totalOrders} recipe orders</span>
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 print:overflow-visible">
                    {sections.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                            No recipes selected. Adjust order counts to add ingredients.
                        </p>
                    ) : (
                        <div className="space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className="print:break-inside-avoid">
                                    <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-green-300">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {section.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex items-start gap-3 group">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-4 h-4 text-green-600 print:hidden"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-gray-900 font-medium">
                                                        {item.display}
                                                    </div>
                                                    {item.examples && (
                                                        <div className="text-xs text-gray-500 mt-1 print:hidden">
                                                            Used in: {item.examples.map(ex =>
                                                                `${ex.recipe} (${ex.count}x)`
                                                            ).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600 print:hidden">
                    <p>
                        💡 Tip: Similar ingredients are automatically combined (e.g., "onion, diced" + "onions" = total onions)
                    </p>
                </div>
            </div>
        </div>
    );
};

window.ShoppingList = ShoppingList;
