export default function roomFeatures() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-4xl mb-3">⭐</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">5-Star Rooms</h3>
                        <p className="text-gray-600">
                            Luxurious rooms with modern amenities and stunning views.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-4xl mb-3">🍽️</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Fine Dining</h3>
                        <p className="text-gray-600">
                            Gourmet restaurants and room service available 24/7.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="text-4xl mb-3">🏊</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">Premium Facilities</h3>
                        <p className="text-gray-600">
                            Swimming pool, spa, and fitness center for your wellness.
                        </p>
                    </div>
                </div>
            </section>
    );
}