# CarRentalService

I have used MVC architecture. Models - All are located in models folder, Controllers - All are located in the routes folder.
To run project do npm install and then npm start.

Server configured for only http and no https. Date format preferrably should be ISO format.

PostMan API Collection Link - https://www.getpostman.com/collections/c01eec7e9150bc218d1d
It includes backend logic for implementation of a car rental service. Backend hosted on ec-2 server of amazon web services. Technology used - NodeJS and mongoose(Based on mongoDB).

Car Operations:

For All cars:
Example url - http://18.191.175.227:3000/cars 
get request - It will return all cars.
post request - It can add new cars. Fields required in request : model, vehicleNo, color, price, seating capacity, name, description.
put request - Not supported
delete request - Will delete all cars

For each car:
Example url - http://18.191.175.227:3000/cars/vehicleNo     : vehicleNo needs to be passed in request body
get request - Will return info for that car.
post request - Not supported
put request - Can update info of particular car if car not currently booked.
delete request - Can delete info of particular car if car not currently booked.

Booking/Transaction Operations:
For all Transactions:
Example url - http://18.191.175.227:3000/transactions
get request - It will return all transactions.
post request - It can add new bookings. Fields required in request : name, vehicleNo, phoneNo, issueDate, returnDate
put request - Not supported
delete request - Will delete all transactions

For each transaction:
Example url - http://18.191.175.227:3000/transactions/transactionId     :  transactionId needs to be passed in request body, i
                                                                           it is the "_id" parameter used directly of mongodb.
                                                                           It can be seen when all transactions are listed.

get request - Will return info for that transaction.
post request - Not supported
put request - Not supported
delete request - Can delete info of particular transaction.


Search Operations:
For all Searches:
Example url - http://18.191.175.227:3000/searches

get Request - Sending issueDate and return date is mandatory in request body. Other parameters on which search can be based are seatingCap. It will return all available cars for the given request.

Any doubts? Contact me at 9871450094.

