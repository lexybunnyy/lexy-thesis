/* erlang.cpp: 
use: 
g++ -o ./../distributedSystem/calculator.so -fpic -shared test.cpp erlang.cpp

g++ -o calculator.so -fpic -shared ./../Calculator/test.cpp ./../Calculator/erlang.cpp
c(calculator).
calculator:exportTest1([4.2, 1.0, 3.2]).
calculator:calculate([0,1], [[0],[1]]).
http://www.erlang.org/doc/man/erl_nif.html 
*/
#include <iostream>
#include <stdio.h>
#include <vector>
#include "erl_nif.h"

using namespace std;

extern int exportTest1(int x);
extern int exportTest2(int y);
static int convertVector(ErlNifEnv* env, ERL_NIF_TERM arg, vector<double> &result);
static ERL_NIF_TERM convertList(ErlNifEnv* env, vector<double> array);

static int convertInterpolationMatrix(ErlNifEnv* env, ERL_NIF_TERM argY, vector<double> &x,vector<vector<double> > &matrix) {
    ERL_NIF_TERM iHead;
    ERL_NIF_TERM iTail = argY;
    ERL_NIF_TERM jHead;
    ERL_NIF_TERM jTail = argY;
    double value;
    int valueInt;
    int i = 0;
    int j;
    while(enif_get_list_cell(env, iTail, &iHead, &iTail)) {
        j = 0;
        jTail = iHead;
        while(enif_get_list_cell(env, jTail, &jHead, &jTail)){
            if (!enif_get_int(env, jHead, &valueInt)) {
                if (!enif_get_double(env, jHead, &value)) {
                   return 0;
                }
            } else {
                value = (double)valueInt;
            }
            cout<< value << " ";
            ++j;
        }
        ++i;
        cout << endl;
    }
    cout << endl;
    return 1;
}

static ERL_NIF_TERM calculate_nif(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[])
{
    int ret;
    int succ;
    vector<double> x;
    vector<vector<double> > M;
    succ = convertVector(env, argv[0], x);
    if (!succ) {
        return enif_make_badarg(env);
    }
    succ = convertInterpolationMatrix(env, argv[1], x, M);
    return convertList(env, x);
}

static ERL_NIF_TERM exportTest1_nif(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[])
{
    int ret;
    int succ;
    vector<double> x;
    succ = convertVector(env, argv[0], x);
    if (!succ) {
        return enif_make_badarg(env);
    }
    return convertList(env, x);
}

static ERL_NIF_TERM exportTest2_nif(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[])
{
    int y, ret;
    //argv elemeinek konvertálása cpp-re
    if (!enif_get_int(env, argv[0], &y)) {
	   return enif_make_badarg(env);
    }

    //Kovertálás után függvény meghívása
    ret = exportTest2(y);

    //visszatérés erlangos int-el
    return enif_make_int(env, ret);
}

static ErlNifFunc nif_funcs[] = {
    {"exportTest1", 1, exportTest1_nif},
    {"exportTest2", 1, exportTest2_nif},
    {"calculate", 2, calculate_nif}
};

static ERL_NIF_TERM convertList(ErlNifEnv* env, vector<double> array) {
    int N = array.size();
    ERL_NIF_TERM conv[N];
    cout << "Hello"<< N <<"\n";
    for (int j = 0; j < N; j++) {
       conv[j] = enif_make_double(env, array[j]);
    }; 

    return enif_make_list_from_array(env, conv, N);
}

static int convertVector(ErlNifEnv* env, ERL_NIF_TERM arg, vector<double> &result) {
    ERL_NIF_TERM head;
    ERL_NIF_TERM tail = arg;
    double x;
    int xInt;
    vector<vector<double> > matrix;
    int size = 0;
    while(enif_get_list_cell(env, tail, &head, &tail)) {
        if (!enif_get_int(env, head, &xInt)) {
            if (!enif_get_double(env, head, &x)) {
               return 0;
            }
        } else {
            x = (double) xInt;
        }
        ++size;
        result.resize(size);
        result[size-1] = x;
    }
    return 1;
}

ERL_NIF_INIT(calculator, nif_funcs, NULL, NULL, NULL, NULL)
