const Ships = require('../ships/models/ship');
const Rank = require('../employees/models/rank');
const Role = require('../employees/models/role');
const Department = require('../employees/models/department')
const DeboardingType = require('../employees/models/deboardingType')


async function dataInitialization() {
    // const ships = [
    //     { shipName: 'INS DHRUV', shipCode: 'DHRUV', noOfEmployees: 400 }
    // ];

    // try {
    //     const ship = await Ships.find();  
    //     if (ship.length === 0) {   
    //         await Ships.insertMany(ships);  // Use await instead of callback
    //     }
    // } catch (err) {
    //     console.error('Error during data initialization:', err);
    // }

    const ranks = [
         {rankName: 'Captain'}, {rankName: 'Commander'}, {rankName: 'Lt Commander'},{rankName: 'Lieutenant'},{rankName: 'Sub Lieutenant'},
         {rankName: 'MCPO I'}, {rankName: 'MCPO II'}, {rankName: 'CPO'},{rankName: 'PO'},{rankName: 'Leading'},{rankName: 'SEAI'},{rankName: 'SEAII'},{rankName: 'Agniveer'}
    ]
    try {
        const rank = await Rank.find();
        if(rank.length === 0) {
            await Rank.insertMany(ranks); // Use await instead of callback
        }
    } 
    catch (error) {
        console.error('Error during data initialization:', error);
    }

    const roles = [
        {roleName: 'Officers'}, {roleName: 'Senior Sailor'},{roleName: 'Junior Sailor'},{roleName: 'Civilian'}
   ]
   try {
       const role = await Role.find();
       if(role.length === 0) {
           await Role.insertMany(roles); // Use await instead of callback
       }
   } 
   catch (error) {
       console.error('Error during data initialization:', error);
   }

   const departments = [
    {departmentName: 'Regulating'}, {departmentName: 'ND'},{departmentName: 'Gunnery'}, {departmentName:'ASW'}, 
    {departmentName:'Engineering'}, {departmentName:'Electrical'}, {departmentName:'Medical'}, {departmentName:'Sports'}, 
    {departmentName:'Writer'}, {departmentName:'Store'}, {departmentName:'Sailor cook'}, {departmentName:'Officer cook'}, 
    {departmentName:'Hygiene'}, {departmentName:'Aviation'}, {departmentName:'Communication'}
    ]
    try {
        const department = await Department.find();
        if(department.length === 0) {
            await Department.insertMany(departments); // Use await instead of callback
        }
    } 
    catch (error) {
        console.error('Error during data initialization:', error);
    }


    const deboardingTypes = [
        {typeName: 'StayIn',description: 'Stay in Ship',curfewTime:'1:00 PM-7:00 PM' },
        {typeName: 'StayOut',description: 'Stay out of Ship',curfewTime:'1:00 PM-7:00 PM' }, 
        {typeName: 'OnLeave',description: 'on leave',curfewTime:'1:00 PM-7:00 PM' },
        {typeName: 'TyDuty',description: 'Ty duty',curfewTime:'1:00 PM-7:00 PM' },
        {typeName: 'Hospital',description: 'hospital',curfewTime:'1:00 PM-7:00 PM' }
    ]
    try {
    const deboardingType = await DeboardingType.find();
    if(deboardingType.length === 0) {
        await DeboardingType.insertMany(deboardingTypes); // Use await instead of callback
    }
    } 
    catch (error) {
    console.error('Error during data initialization:', error);
    }




}

module.exports = dataInitialization;
