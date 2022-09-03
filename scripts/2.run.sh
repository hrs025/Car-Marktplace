#echo 'Call create() function to add new cars to the contract'

near call $CONTRACT create '{"age":5,"carModel":"Hyundaii20", "kilometer":200, "forSale":"false", "price":"22000000000000"}' --accountId hrs069.testnet


#echo 'call getAll() function to view all stored cars on the contract'

near call $CONTRACT getAll --accountId $OWNER --gas 300000000000000 --amount 3


#echo 'call getForSale() function to view for sale cars stored on the contract'

near call $CONTRACT getForSale --accountId $OWNER --gas 300000000000000 --amount 3


#echo 'call getOffset() function to view part of cars stored on the contract'

near call $CONTRACT getOffset '{"offset":'$1', "limit": '$2'}' --accountId $OWNER --gas 300000000000000 --amount 3


#echo 'call getById() function to view car by id on the contract'

near call $CONTRACT getById '{"id":'$1'}' --accountId $OWNER


#echo 'Call updateById() function to update car details on the contract'

near call $CONTRACT updateById '{"id":'$1',"update":'$2'}' --accountId $OWNER


#echo 'Call deleteById() function to update car details on the contract'

near call $CONTRACT deleteById '{"id":'$1'}' --accountId $OWNER


#echo 'Call buy() function to buying car and transfer amount of price buying price should be higher or equal of sell price of car details on the contract'

near call $CONTRACT buy '{"id":'$1',"buyingPrice":"'$2'" }' --accountId $3 #3=buyer