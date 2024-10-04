#include <stdio.h>
#include <stdlib.h>
#include <mysql/mysql.h>
#include <time.h>

MYSQL* connect_to_database(char *host, char *user, char *password, char *dbname){
    MYSQL* conn = mysql_init(NULL);
    mysql_real_connect(conn, host, user, password, dbname, 0, NULL, 0);
    return conn;
}

MYSQL_RES* execute_query(MYSQL* connection, char* query){
    mysql_query(connection, query);
    MYSQL_RES* res = mysql_store_result(connection);    
    return res;
}

int main(){
    char* password = getenv("MySQL");
    MYSQL* connection = connect_to_database("localhost", "root", password, "hotel_management");

    clock_t start_time = clock();

    clock_t end_time = clock();
    char* query = "SELECT DISTINCT MONTHNAME(b.check_in) AS month_name FROM rooms r JOIN bookings b ON r.room_no = b.room_no WHERE r.type = 'deluxe' AND YEAR(b.check_in) = 2023 ORDER BY MONTH(b.check_in)";
    MYSQL_RES* res = execute_query(connection, query);
    double time_taken = (double)(end_time - start_time) / CLOCKS_PER_SEC;

    printf("Execution Time: %f\n", time_taken);
    return 0;
}